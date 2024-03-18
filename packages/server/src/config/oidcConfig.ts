import {
  AuthorizationParameters,
  ClientMetadata,
  GrantBody,
  IssuerMetadata,
} from 'openid-client';

export const oidcConfig = {
  OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID,
  OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET,
  OIDC_ISSUER: process.env.OIDC_ISSUER,
  OIDC_AUTHORIZATION_ENDPOINT: process.env.OIDC_AUTHORIZATION_ENDPOINT,
  OIDC_TOKEN_ENDPOINT: process.env.OIDC_TOKEN_ENDPOINT,
  OIDC_USERINFO_ENDPOINT: process.env.OIDC_USERINFO_ENDPOINT,
  OIDC_ENDSESSION_ENDPOINT: process.env.OIDC_ENDSESSION_ENDPOINT,
  OIDC_REVOCATION_ENDPOINT: process.env.OIDC_REVOCATION_ENDPOINT,
  OIDC_REDIRECT_URI: process.env.OIDC_REDIRECT_URI,
  OIDC_SCOPE: process.env.OIDC_SCOPE,
  OIDC_JWK_URI: process.env.OIDC_JWK_URI,
};

export const issuerMetadata: IssuerMetadata = {
  issuer: oidcConfig.OIDC_ISSUER,
  authorization_endpoint: oidcConfig.OIDC_AUTHORIZATION_ENDPOINT,
  token_endpoint: oidcConfig.OIDC_TOKEN_ENDPOINT,
  userinfo_endpoint: oidcConfig.OIDC_USERINFO_ENDPOINT,
  end_session_endpoint: oidcConfig.OIDC_ENDSESSION_ENDPOINT,
  revocation_endpoint: oidcConfig.OIDC_REVOCATION_ENDPOINT,
  jwks_uri: oidcConfig.OIDC_JWK_URI,
};

export const clientMetadata: ClientMetadata = {
  client_id: oidcConfig.OIDC_CLIENT_ID,
  client_secret: oidcConfig.OIDC_CLIENT_SECRET,
  redirect_uris: [oidcConfig.OIDC_REDIRECT_URI],
  token_endpoint_auth_method: 'client_secret_basic',
  id_token_signed_response_alg: 'RS256',
  post_logout_redirect_uris: [oidcConfig.OIDC_REDIRECT_URI],
  response_types: ['code', 'token', 'id_token'],
};

export const authorizationUrlParameters: AuthorizationParameters = {
  scope: oidcConfig.OIDC_SCOPE,
  response_type: 'code',
};

export const tokenGrantBody: GrantBody = {
  grant_type: 'authorization_code',
  redirect_uri: oidcConfig.OIDC_REDIRECT_URI,
};
