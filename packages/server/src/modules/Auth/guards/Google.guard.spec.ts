import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from './Google.guard';
import { ERRORS } from '../Auth.constants';

describe('GoogleAuthGuard', () => {
  const createContext = () => {
    const response = { headersSent: false, redirect: jest.fn() };
    const context = {
      switchToHttp: () => ({ getResponse: () => response }),
    } as unknown as ExecutionContext;

    return { context, response };
  };

  const createGuard = () =>
    new GoogleAuthGuard({
      get: jest.fn().mockReturnValue('http://localhost:4000/auth/login'),
    } as unknown as ConfigService);

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the user without redirecting on success', () => {
    const { context, response } = createContext();
    const user = { id: 1 };

    expect(createGuard().handleRequest(null, user, null, context)).toBe(user);
    expect(response.redirect).not.toHaveBeenCalled();
  });

  it('replaces internal error messages with a generic code', () => {
    const { context, response } = createContext();
    const error = new Error(
      "select `USERS`.* from `USERS` where `GOOGLE_ID` = 'x' - " +
        "ER_BAD_FIELD_ERROR: Unknown column 'GOOGLE_ID' in 'where clause'",
    );

    createGuard().handleRequest(error, null, null, context);

    expect(response.redirect).toHaveBeenCalledWith(
      'http://localhost:4000/auth/login?error=google_auth_failed',
    );
  });

  it('passes through standard passport OAuth error codes', () => {
    const { context, response } = createContext();

    createGuard().handleRequest(
      null,
      null,
      { message: 'access_denied' },
      context,
    );

    expect(response.redirect).toHaveBeenCalledWith(
      'http://localhost:4000/auth/login?error=access_denied',
    );
  });

  it('maps inactive accounts to a stable code', () => {
    const { context, response } = createContext();
    const error = new UnauthorizedException({
      message: 'The user account is inactive.',
      errors: [{ type: ERRORS.USER_INACTIVE }],
    });

    createGuard().handleRequest(error, null, null, context);

    expect(response.redirect).toHaveBeenCalledWith(
      'http://localhost:4000/auth/login?error=account_inactive',
    );
  });

  it('does not redirect when the response has already been sent', () => {
    const { context, response } = createContext();
    response.headersSent = true;

    createGuard().handleRequest(new Error('boom'), null, null, context);

    expect(response.redirect).not.toHaveBeenCalled();
  });
});
