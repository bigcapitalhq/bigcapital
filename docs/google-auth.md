# Google Sign-In Configuration

Bigcapital supports signing in and signing up with Google through the
**Continue with Google** button shown on the login and registration pages.

The integration is server-side (OAuth 2.0 authorization-code flow), so no Google
credentials are ever shipped to the browser. The button is only rendered when
the server reports that Google sign-in is enabled.

- [How it works](#how-it-works)
- [1. Create Google OAuth credentials](#1-create-google-oauth-credentials)
- [2. Configure environment variables](#2-configure-environment-variables)
- [3. Run the database migration](#3-run-the-database-migration)
- [4. Verify the setup](#4-verify-the-setup)
- [Production and reverse-proxy notes](#production-and-reverse-proxy-notes)
- [Disabling Google sign-in](#disabling-google-sign-in)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)

## How it works

```
Browser                API server                       Google
   │  GET /api/auth/google  │                              │
   ├───────────────────────>│  redirect + signed state      │
   │                        ├─────────────────────────────>│
   │                        │        user consent          │
   │  GET /api/auth/google/callback?code=…&state=…          │
   ├───────────────────────>│  verify state, exchange code │
   │                        ├─────────────────────────────>│
   │                        │<───── profile ───────────────┤
   │  302 to web app        │  resolve/create user, sign JWT
   │<───────────────────────┤
   │  /auth/google/callback?token=…&…                       │
   │  store auth cookies and continue to the app            │
```

Account resolution order:

1. A user already linked to the Google account id signs in.
2. A user with the same (Google-verified) email is linked to the Google id.
   Any pending email confirmation is satisfied by Google.
3. A new user is created with a new workspace, subject to the normal sign-up
   restrictions (`SIGNUP_DISABLED`, `SIGNUP_ALLOWED_DOMAINS`,
   `SIGNUP_ALLOWED_EMAILS`).

Existing password accounts keep working. Google-created accounts do not have a
password, so they must continue using Google until a password is set.

## 1. Create Google OAuth credentials

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Configure the **OAuth consent screen**:
   - Choose **External** unless this is a Google Workspace-only deployment.
   - Add the application name, support email, and developer contact.
   - While the app is in **Testing**, add every Google account that should be
     able to sign in under **Test users**.
4. Go to **APIs & Services → Credentials → Create credentials → OAuth client ID**.
5. Select **Web application**.
6. Under **Authorized redirect URIs**, add the exact callback URL that the API
   server will expose. For local development:

   ```
   http://localhost:3000/api/auth/google/callback
   ```

   For production, use the public API URL, for example:

   ```
   https://api.example.com/api/auth/google/callback
   ```

   The value must match `GOOGLE_CALLBACK_URL` exactly, including scheme, host,
   port, and path. A mismatch produces `redirect_uri_mismatch` from Google.

7. Copy the generated **Client ID** and **Client secret**.

> JavaScript origins are not required for this server-side flow. Only the
> authorized redirect URI is used.

## 2. Configure environment variables

Add the following to the root `.env` (see `.env.example`). Restart the server
after changing any of them.

| Variable | Required | Description |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | Yes | OAuth 2.0 client ID from Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | Yes | OAuth 2.0 client secret from Google Cloud Console. |
| `GOOGLE_CALLBACK_URL` | Yes | Callback handled by the API. Must be registered as an authorized redirect URI. |
| `GOOGLE_AUTH_SUCCESS_REDIRECT_URL` | Recommended | Web-app page that receives the issued JWT. Defaults to `http://localhost:4000/auth/google/callback`. |
| `GOOGLE_AUTH_FAILURE_REDIRECT_URL` | Recommended | Web-app page used when authentication fails or is cancelled. Defaults to `http://localhost:4000/auth/login`. |

Google sign-in is considered **enabled** only when both `GOOGLE_CLIENT_ID` and
`GOOGLE_CLIENT_SECRET` are non-empty. When disabled, the button is hidden and
`GET /api/auth/google` responds with `503 Service Unavailable`.

### Local development example

```env
GOOGLE_CLIENT_ID=1234567890-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
GOOGLE_AUTH_SUCCESS_REDIRECT_URL=http://localhost:4000/auth/google/callback
GOOGLE_AUTH_FAILURE_REDIRECT_URL=http://localhost:4000/auth/login
```

- The API runs on port `3000` in development.
- The Vite web app runs on port `4000`.
- The callback points at the API directly (Google redirects the browser to it),
  while the success/failure redirects point at the web app.

### Production example

```env
GOOGLE_CLIENT_ID=1234567890-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=https://api.example.com/api/auth/google/callback
GOOGLE_AUTH_SUCCESS_REDIRECT_URL=https://app.example.com/auth/google/callback
GOOGLE_AUTH_FAILURE_REDIRECT_URL=https://app.example.com/auth/login
```

Use absolute URLs. If the API and web app share an origin, the same host can be
used for all three values.

## 3. Run the database migration

Google sign-in links users through a `google_id` column on the system `users`
table. Apply the system database migrations once:

```bash
pnpm run system:migrate:latest
```

This is only needed when upgrading an existing installation. Fresh installs get
the column from the standard migration run.

## 4. Verify the setup

1. Start the API and web app.
2. Check that the server reports Google as enabled:

   ```bash
   curl http://localhost:3000/api/auth/meta
   ```

   Expected response (the API wire format is snake_case):

   ```json
   { "signup_disabled": false, "google_enabled": true }
   ```

3. Open `/auth/login` and confirm the **Continue with Google** button is shown.
4. Click it. The browser should redirect to `accounts.google.com`, then return to
   the app already signed in.

If the button is missing, the server is either not configured, was not
restarted, or `/api/auth/meta` returns `google_enabled: false`.

## Production and reverse-proxy notes

- Use HTTPS for both the API and the web app. The OAuth state cookie is marked
  `Secure` when the request arrives over HTTPS.
- If TLS terminates at a proxy, forward `X-Forwarded-Proto: https` so the state
  cookie is created correctly.
- The callback URL must be reachable by the browser at the public API domain.
  Update both `GOOGLE_CALLBACK_URL` and the Google Console redirect URI whenever
  the domain changes.
- Keep `APP_JWT_SECRET` stable. It signs both auth JWTs and the OAuth `state`
  value.
- If the OAuth consent screen is still in **Testing**, only listed test users can
  complete sign-in. Publish the app to allow all Google accounts.

## Disabling Google sign-in

Remove or empty `GOOGLE_CLIENT_ID` and/or `GOOGLE_CLIENT_SECRET`, then restart
the server. Existing Google-linked users can still sign in with a password if
they set one; otherwise they must wait until Google sign-in is re-enabled.

## Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| `redirect_uri_mismatch` from Google | `GOOGLE_CALLBACK_URL` does not exactly match an authorized redirect URI in Google Cloud Console. |
| Button not visible | Credentials missing, server not restarted, or `/api/auth/meta` reports `google_enabled: false`. |
| `503 Google sign-in is not configured on this instance.` | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are empty. |
| Redirected to login with `error=google_auth_failed` | Consent cancelled, state expired (10-minute limit), cookies blocked, or the code exchange failed. Check the API logs. |
| Redirected with `error=no_active_workspace` | The account has no active workspace membership. Invited users must accept their invite first. |
| `The given email address format is not allowed to signup.` | Sign-up restrictions block the Google email. Adjust `SIGNUP_ALLOWED_DOMAINS` / `SIGNUP_ALLOWED_EMAILS` or the account. |
| `This email address is linked to a different Google account.` | The email is already linked to another Google id. Sign in with the original Google account. |
| Accounts are created but land on an empty app | Ensure the tenant build/seed process is running; Google sign-up uses the same flow as email sign-up. |

## Security notes

- The OAuth `state` is a random nonce plus timestamp signed with
  `APP_JWT_SECRET`, stored in an http-only, `SameSite=Lax` cookie for 10 minutes.
  A callback is only accepted when the returned state matches the browser
  cookie.
- The issued JWT is passed to the web app in the redirect query string, then the
  web app stores it in cookies and replaces the current history entry with `/`.
  Always serve the app over HTTPS in production.
- Never commit `GOOGLE_CLIENT_SECRET` or any real credentials to the repository.
