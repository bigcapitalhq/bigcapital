# Enterprise SAML single sign-on

In Bigcapital Enterprise, an organization administrator can enable SAML 2.0 under **Preferences → General → Single sign-on (SAML)**. Each organization has its own identity provider settings, service provider entity ID, callback URL and sign-in link. Members can continue to use their existing sign-in methods.

## Deployment

Set `BASE_URL` to the public HTTPS origin that serves the webapp and routes `/api` to the server. The browser starts and completes sign-in at that origin. All API instances need access to the same Redis instance for the short-lived, single-use login state. The bundled Redis 6.2 supports the required commands.

Build the server and apply the system database migrations before enabling SSO.

```sh
pnpm install --frozen-lockfile
pnpm run build:server
pnpm run system:migrate:latest
```

## Connect an identity provider

1. Open the organization's SAML preferences. Import its metadata URL into a SAML application at your identity provider, or copy the service provider entity ID into the audience field and the assertion consumer service (ACS) URL into the reply URL field.
2. Configure the provider to accept unsigned HTTP-Redirect authentication requests and return **signed, unencrypted assertions** using HTTP-POST. Set the NameID format to **emailAddress** and its value to the member's verified Bigcapital email address. Assign the intended users to the application.
3. In Bigcapital, enter the provider's entity ID, HTTPS sign-in URL and public X.509 signing certificate in PEM format. Enable SAML and save.
4. Open the organization's sign-in URL in a separate browser session. Sign in as an existing, active member and confirm the organization shown in Bigcapital. Members can also choose **Sign in with SSO** and enter the organization ID.

Members who have enrolled in Bigcapital two-factor authentication complete that step after the identity provider returns them to Bigcapital. If enrollment is required, they first sign in with their existing method to set up their account-wide second factor. Account-wide changes and switching organizations require a separate sign-in.

Update the certificate in the same preferences when the provider rotates its signing key. Disabling SAML stops new SSO sign-ins for that organization. An already-issued session lasts until its token expires, subject to the user's continued access to the organization.
