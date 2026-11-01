import request = require('supertest');
import {
  app,
  AuthorizationHeader,
  orgainzationId,
  authenticatedUserId,
} from './init-app-test';
import { generateTotpCode } from '../src/modules/Auth/two-factor/totp';
import { TwoFactorService } from '../src/modules/Auth/two-factor/TwoFactor.service';
import { TwoFactorPolicyService } from '../src/modules/Auth/two-factor/TwoFactorPolicy.service';
import { TenantModel } from '../src/modules/System/models/TenantModel';
import { TwoFactorChallenge } from '../src/modules/Auth/two-factor/models/TwoFactorChallenge.model';

// The e2e user of init-app-test.ts.
const email = 'kk@kk.com';
const password = '1231231230';

const STEP_MS = 30 * 1000;

const signin = () =>
  request(app.getHttpServer()).post('/auth/signin').send({ email, password });

describe('Two-factor authentication (e2e)', () => {
  let secret = '';
  let recoveryCodes: string[] = [];

  const resetChallenges = () =>
    TwoFactorChallenge.query().where('userId', authenticatedUserId).delete();

  // Failed codes of an earlier run would count toward the per-user limit.
  beforeAll(() => resetChallenges());

  afterAll(async () => {
    // Leave the shared e2e user as it was, whatever failed above. Straight
    // through the services: a failed test can leave the session refused.
    const tenant = await TenantModel.query().findOne({
      organizationId: orgainzationId,
    });
    if (tenant) {
      await app
        .get(TwoFactorPolicyService)
        .setRequired(tenant.id, orgainzationId, false);
    }
    await app.get(TwoFactorService).removeAll(authenticatedUserId);
    await resetChallenges();
  });

  it('reports two-factor as off', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/two-factor')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);

    expect(res.body.enabled).toBe(false);
  });

  it('signs in with the password only while two-factor is off', async () => {
    const res = await signin().expect(201);

    expect(res.body.access_token).toBeTruthy();
    expect(res.body.two_factor_required).toBeUndefined();
  });

  it('refuses to require two-factor before the admin has it', async () => {
    const res = await request(app.getHttpServer())
      .put('/organization/two-factor')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({ required: true })
      .expect(400);

    expect(res.body.errors[0].type).toBe('TWO_FACTOR_ENABLE_OWN_FIRST');
  });

  it('sets up two-factor: secret, wrong code, right code, recovery codes', async () => {
    const setup = await request(app.getHttpServer())
      .post('/auth/two-factor/setup')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);

    secret = setup.body.secret;
    expect(secret).toMatch(/^[A-Z2-7]{32}$/);
    expect(setup.body.otpauth_url).toContain(`secret=${secret}`);

    const wrong = await request(app.getHttpServer())
      .post('/auth/two-factor/setup/confirm')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({
        code: '000000' === generateTotpCode(secret) ? '111111' : '000000',
      })
      .expect(400);
    expect(wrong.body.errors[0].type).toBe('TWO_FACTOR_CODE_INVALID');

    const confirm = await request(app.getHttpServer())
      .post('/auth/two-factor/setup/confirm')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({ code: generateTotpCode(secret) })
      .expect(200);

    recoveryCodes = confirm.body.recovery_codes;
    expect(recoveryCodes).toHaveLength(10);

    const status = await request(app.getHttpServer())
      .get('/auth/two-factor')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);
    expect(status.body.enabled).toBe(true);
    expect(status.body.recovery_codes_remaining).toBe(10);
    expect(JSON.stringify(status.body)).not.toContain(secret);
  });

  it('asks for a code after the password, without a token', async () => {
    const res = await signin().expect(201);

    expect(res.body.two_factor_required).toBe(true);
    expect(res.body.challenge_token).toBeTruthy();
    expect(res.body.access_token).toBeUndefined();
  });

  it('refuses a wrong code and a replayed code, accepts a fresh one', async () => {
    const { body } = await signin();
    const challenge = body.challenge_token;

    const wrong = await request(app.getHttpServer())
      .post('/auth/signin/2fa')
      .send({
        challenge_token: challenge,
        code: '123456' === generateTotpCode(secret) ? '654321' : '123456',
      })
      .expect(401);
    expect(wrong.body.code).toBe('TWO_FACTOR_CODE_INVALID');

    // The current step was used by the setup confirmation: a replay.
    const replay = await request(app.getHttpServer())
      .post('/auth/signin/2fa')
      .send({ challenge_token: challenge, code: generateTotpCode(secret) })
      .expect(401);
    expect(replay.body.code).toBe('TWO_FACTOR_CODE_INVALID');

    // The next step is inside the accepted window.
    const ok = await request(app.getHttpServer())
      .post('/auth/signin/2fa')
      .send({
        challenge_token: challenge,
        code: generateTotpCode(secret, Date.now() + STEP_MS),
      })
      .expect(201);
    expect(ok.body.access_token).toBeTruthy();
    expect(ok.body.organization_id).toBe(orgainzationId);

    // A challenge works once.
    const again = await request(app.getHttpServer())
      .post('/auth/signin/2fa')
      .send({ challenge_token: challenge, code: '000000' })
      .expect(401);
    expect(again.body.code).toBe('TWO_FACTOR_CHALLENGE_INVALID');
  });

  it('accepts a recovery code once', async () => {
    const first = await signin();
    await request(app.getHttpServer())
      .post('/auth/signin/2fa')
      .send({
        challenge_token: first.body.challenge_token,
        recovery_code: recoveryCodes[0].toUpperCase(),
      })
      .expect(201);

    const second = await signin();
    const reused = await request(app.getHttpServer())
      .post('/auth/signin/2fa')
      .send({
        challenge_token: second.body.challenge_token,
        recovery_code: recoveryCodes[0],
      })
      .expect(401);
    expect(reused.body.code).toBe('TWO_FACTOR_CODE_INVALID');
  });

  it('limits the attempts per challenge', async () => {
    const { body } = await signin();
    const wrongCode =
      '999999' === generateTotpCode(secret) ? '888888' : '999999';

    for (let i = 0; i < 4; i++) {
      await request(app.getHttpServer())
        .post('/auth/signin/2fa')
        .send({ challenge_token: body.challenge_token, code: wrongCode })
        .expect(401);
    }
    const blocked = await request(app.getHttpServer())
      .post('/auth/signin/2fa')
      .send({ challenge_token: body.challenge_token, code: wrongCode })
      .expect(401);
    // The 5th attempt is still a wrong code; the 6th has no attempts left.
    expect(blocked.body.code).toBe('TWO_FACTOR_CODE_INVALID');

    const exhausted = await request(app.getHttpServer())
      .post('/auth/signin/2fa')
      .send({
        challenge_token: body.challenge_token,
        code: generateTotpCode(secret, Date.now() + STEP_MS),
      })
      .expect(401);
    expect(exhausted.body.code).toBe('TWO_FACTOR_CHALLENGE_INVALID');
  });

  it('requires a session (not an API key) to change two-factor settings', async () => {
    const key = await request(app.getHttpServer())
      .post('/api-keys/generate')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({ name: 'two-factor e2e' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/two-factor/disable')
      .set('Authorization', `Bearer ${key.body.key}`)
      .send({ password, recovery_code: recoveryCodes[1] })
      .expect(403);

    // The API key keeps working for data.
    await request(app.getHttpServer())
      .get('/items')
      .set('Authorization', `Bearer ${key.body.key}`)
      .expect(200);

    await request(app.getHttpServer())
      .put(`/api-keys/${key.body.id}/revoke`)
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId);
  });

  it('regenerates recovery codes with the password and a code', async () => {
    await request(app.getHttpServer())
      .post('/auth/two-factor/recovery-codes')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({ password: 'wrong-password', recovery_code: recoveryCodes[1] })
      .expect(400);

    const res = await request(app.getHttpServer())
      .post('/auth/two-factor/recovery-codes')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({ password, recovery_code: recoveryCodes[1] })
      .expect(200);

    expect(res.body.recovery_codes).toHaveLength(10);
    expect(res.body.recovery_codes).not.toContain(recoveryCodes[2]);
    recoveryCodes = res.body.recovery_codes;
  });

  it('enforces the organization requirement on sessions without two-factor', async () => {
    await request(app.getHttpServer())
      .put('/organization/two-factor')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({ required: true })
      .expect(200);

    // Turn our own two-factor off: the old session no longer gets data.
    await request(app.getHttpServer())
      .post('/auth/two-factor/disable')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({ password, recovery_code: recoveryCodes[0] })
      .expect(200);

    const blocked = await request(app.getHttpServer())
      .get('/items')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(401);
    expect(blocked.body.code).toBe('TWO_FACTOR_SETUP_REQUIRED');

    // Sign-in now asks for the setup, then signs in with the new codes.
    const { body } = await signin().expect(201);
    expect(body.two_factor_setup_required).toBe(true);
    expect(body.access_token).toBeUndefined();

    const setup = await request(app.getHttpServer())
      .post('/auth/signin/2fa/setup')
      .send({ challenge_token: body.challenge_token })
      .expect(201);
    secret = setup.body.secret;

    const confirmed = await request(app.getHttpServer())
      .post('/auth/signin/2fa/setup/confirm')
      .send({
        challenge_token: body.challenge_token,
        code: generateTotpCode(secret),
      })
      .expect(201);
    expect(confirmed.body.access_token).toBeTruthy();
    expect(confirmed.body.recovery_codes).toHaveLength(10);

    // The old session works again now that the user has two-factor.
    await request(app.getHttpServer())
      .get('/items')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);
  });
});
