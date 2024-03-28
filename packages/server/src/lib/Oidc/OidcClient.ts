import { clientMetadata, issuerMetadata } from '@/config/oidcConfig';
import { Issuer } from 'openid-client';

const issuer = new Issuer(issuerMetadata);

export const oidcClient = new issuer.Client(clientMetadata);
