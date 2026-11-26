import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import {
  CacheProvider,
  generateServiceProviderMetadata,
  Profile,
  SAML,
  ValidateInResponseTo,
} from '@node-saml/node-saml';
import { createHash, randomBytes } from 'crypto';
import { isEmail } from 'class-validator';
import { SamlSettingsService } from './SamlSettings.service';

const EMAIL_NAME_ID = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress';
const BEARER = 'urn:oasis:names:tc:SAML:2.0:cm:bearer';
export const SAML_LOGIN_TTL_MS = 10 * 60 * 1000;
const ASSERTION_AGE_MS = 5 * 60 * 1000;
const CLOCK_SKEW_MS = 60 * 1000;
const EXCHANGE_TTL_MS = 60 * 1000;
const TOKEN = /^[a-f0-9]{64}$/;

type Settings = Awaited<ReturnType<SamlSettingsService['getEnabled']>>;

interface VerifiedAssertion {
  $?: { IssueInstant?: string };
  AuthnStatement?: unknown[];
  Subject?: {
    NameID?: { _?: string; $?: { Format?: string } }[];
    SubjectConfirmation?: {
      $?: { Method?: string };
      SubjectConfirmationData?: {
        $?: {
          InResponseTo?: string;
          Recipient?: string;
          NotBefore?: string;
          NotOnOrAfter?: string;
        };
      }[];
    }[];
  }[];
}

function digest(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function trustKey(settings: Settings): string {
  return digest(
    JSON.stringify([
      settings.tenantId,
      settings.entityId,
      settings.acsUrl,
      settings.idpCertificate,
      settings.idpEntityId,
      settings.idpSsoUrl,
    ]),
  );
}

function invalidSignin(): UnauthorizedException {
  return new UnauthorizedException('SAML sign-in failed. Start a new sign-in.');
}

// node-saml 5.x validates signatures, issuer, audience, request ID and time
// limits. Enforce the intended recipient on the verified bearer confirmation.
function verifiedEmail(profile: Profile, acsUrl: string): string {
  const assertion = profile?.getAssertion?.()?.Assertion as VerifiedAssertion;
  const subject = assertion?.Subject?.[0];
  const nameId = subject?.NameID?.[0];
  const now = Date.now();
  const issued = Date.parse(assertion?.$?.IssueInstant);
  const validBearer = subject?.SubjectConfirmation?.some((confirmation) => {
    const data = confirmation.SubjectConfirmationData?.[0]?.$;
    return (
      confirmation.$?.Method === BEARER &&
      data?.Recipient === acsUrl &&
      !!data.InResponseTo &&
      data.InResponseTo === profile.inResponseTo &&
      Date.parse(data.NotOnOrAfter) > now - CLOCK_SKEW_MS &&
      (!data.NotBefore || Date.parse(data.NotBefore) <= now + CLOCK_SKEW_MS)
    );
  });
  if (
    !validBearer ||
    !Number.isFinite(issued) ||
    issued > now + CLOCK_SKEW_MS ||
    issued + ASSERTION_AGE_MS <= now - CLOCK_SKEW_MS ||
    !assertion.AuthnStatement?.length ||
    assertion.Subject.length !== 1 ||
    subject.NameID?.length !== 1 ||
    nameId.$?.Format !== EMAIL_NAME_ID ||
    typeof nameId._ !== 'string' ||
    !isEmail(nameId._)
  ) {
    throw invalidSignin();
  }
  return nameId._;
}

@Injectable()
export class SamlProtocolService {
  constructor(
    private readonly settings: SamlSettingsService,
    private readonly redis: RedisService,
  ) {}

  metadata(organizationId: string): string {
    const { entityId, acsUrl } =
      this.settings.getServiceProvider(organizationId);
    return generateServiceProviderMetadata({
      issuer: entityId,
      callbackUrl: acsUrl,
      identifierFormat: EMAIL_NAME_ID,
      wantAssertionsSigned: true,
    });
  }

  async start(organizationId: string) {
    const config = await this.settings.getEnabled(organizationId);
    const browserSecret = randomBytes(32).toString('hex');
    const relay = digest(browserSecret);
    const redirectUrl = await this.provider(config, relay).getAuthorizeUrlAsync(
      relay,
      {},
    );
    return { browserSecret, redirectUrl };
  }

  async accept(organizationId: string, relay: unknown, response: unknown) {
    if (
      typeof relay !== 'string' ||
      !TOKEN.test(relay) ||
      typeof response !== 'string' ||
      !response
    ) {
      throw invalidSignin();
    }
    const config = await this.settings.getEnabled(organizationId);
    const { profile, loggedOut } = await this.provider(
      config,
      relay,
    ).validatePostResponseAsync({ SAMLResponse: response });
    if (!profile || loggedOut) {
      throw invalidSignin();
    }
    const email = verifiedEmail(profile, config.acsUrl);
    const code = randomBytes(32).toString('hex');
    const identity = {
      organizationId: config.organizationId,
      email,
      trust: trustKey(config),
    };
    await this.redis
      .getOrThrow()
      .set(
        this.exchangeKey(relay, code),
        JSON.stringify(identity),
        'PX',
        EXCHANGE_TTL_MS,
      );
    return code;
  }

  async redeem(browserSecret: string | undefined, code: unknown) {
    if (
      !browserSecret ||
      !TOKEN.test(browserSecret) ||
      typeof code !== 'string' ||
      !TOKEN.test(code)
    ) {
      throw invalidSignin();
    }
    const value = await this.redis
      .getOrThrow()
      .getdel(this.exchangeKey(digest(browserSecret), code));
    if (!value) {
      throw invalidSignin();
    }
    const { organizationId, email, trust } = JSON.parse(value) as {
      organizationId: string;
      email: string;
      trust: string;
    };
    const config = await this.settings.getEnabled(organizationId);
    if (trust !== trustKey(config)) {
      throw invalidSignin();
    }
    return { organizationId, email };
  }

  private exchangeKey(relay: string, code: string): string {
    return `saml:exchange:${relay}:${digest(code)}`;
  }

  private provider(config: Settings, relay: string): SAML {
    const client = this.redis.getOrThrow();
    const prefix = `saml:${trustKey(config)}`;
    const request = (id: string) => `${prefix}:request:${relay}:${digest(id)}`;
    const cacheProvider: CacheProvider = {
      async saveAsync(id, value) {
        await client.set(request(id), value, 'PX', SAML_LOGIN_TTL_MS);
        return { value, createdAt: Date.now() };
      },
      getAsync: (id) => client.get(request(id)),
      consumeAsync: (id) => client.getdel(request(id)),
      removeAsync: (id) =>
        id ? client.getdel(request(id)) : Promise.resolve(null),
      async saveIfAbsentAsync(id, value, expiresAtMs) {
        const ttl = Math.max(1, expiresAtMs - Date.now());
        const saved = await client.set(
          `${prefix}:assertion:${digest(id)}`,
          value,
          'PX',
          ttl,
          'NX',
        );
        return saved === 'OK';
      },
    };
    return new SAML({
      issuer: config.entityId,
      callbackUrl: config.acsUrl,
      audience: config.entityId,
      idpIssuer: config.idpEntityId,
      idpCert: config.idpCertificate,
      entryPoint: config.idpSsoUrl,
      identifierFormat: EMAIL_NAME_ID,
      wantAssertionsSigned: true,
      wantAuthnResponseSigned: false,
      disableRequestedAuthnContext: true,
      validateInResponseTo: ValidateInResponseTo.always,
      requestIdExpirationPeriodMs: SAML_LOGIN_TTL_MS,
      maxAssertionAgeMs: ASSERTION_AGE_MS,
      acceptedClockSkewMs: CLOCK_SKEW_MS,
      rejectReplayedAssertions: true,
      cacheProvider,
    });
  }
}
