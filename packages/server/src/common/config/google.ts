import { registerAs } from '@nestjs/config';

/**
 * Google OAuth configuration.
 *
 * Google sign-in is enabled only when both the client id and client secret are
 * configured. The redirect URLs point back to the web app after the OAuth
 * round-trip (the server itself only produces the JWT and redirects).
 */
export default registerAs('google', () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  return {
    enabled: Boolean(clientId && clientSecret),
    clientId,
    clientSecret,
    // Must exactly match an "Authorized redirect URI" in the Google console.
    callbackUrl:
      process.env.GOOGLE_CALLBACK_URL ??
      'http://localhost:3000/api/auth/google/callback',
    // Where the browser is sent after a successful authentication.
    successRedirectUrl:
      process.env.GOOGLE_AUTH_SUCCESS_REDIRECT_URL ??
      'http://localhost:4000/auth/google/callback',
    // Where the browser is sent when authentication fails or is cancelled.
    failureRedirectUrl:
      process.env.GOOGLE_AUTH_FAILURE_REDIRECT_URL ??
      'http://localhost:4000/auth/login',
  };
});
