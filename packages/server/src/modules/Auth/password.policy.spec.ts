import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthSignupDto } from './dtos/AuthSignup.dto';
import { AuthResetPasswordDto } from './dtos/AuthResetPassword.dto';
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from './password.policy';

const validBase = { firstName: 'A', lastName: 'B', email: 'a@b.co' };

const expectInvalid = async (password: string) => {
  const errors = await validate(
    plainToInstance(AuthSignupDto, { ...validBase, password }),
  );
  expect(errors.length).toBeGreaterThan(0);
};

const expectValid = async (password: string) => {
  const errors = await validate(
    plainToInstance(AuthSignupDto, { ...validBase, password }),
  );
  expect(errors).toHaveLength(0);
};

describe('password policy (AuthSignupDto)', () => {
  it('rejects an empty password', async () => {
    await expectInvalid('');
  });

  it('rejects a one-character password', async () => {
    await expectInvalid('x');
  });

  it(`rejects passwords shorter than ${PASSWORD_MIN_LENGTH} characters`, async () => {
    await expectInvalid('123456789');
  });

  it(`accepts a ${PASSWORD_MIN_LENGTH}-character password`, async () => {
    await expectValid('1234567890');
  });

  it('accepts a long passphrase', async () => {
    await expectValid('a'.repeat(100));
  });

  it(`rejects passwords longer than ${PASSWORD_MAX_LENGTH} characters`, async () => {
    await expectInvalid('a'.repeat(PASSWORD_MAX_LENGTH + 1));
  });
});

describe('password policy (AuthResetPasswordDto)', () => {
  it('rejects a short password', async () => {
    const errors = await validate(
      plainToInstance(AuthResetPasswordDto, { password: 'short' }),
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  it('accepts a valid password', async () => {
    const errors = await validate(
      plainToInstance(AuthResetPasswordDto, { password: '1234567890' }),
    );
    expect(errors).toHaveLength(0);
  });
});
