import { JwtStrategy } from './Jwt.strategy';

describe('JwtStrategy fail-fast', () => {
  it('refuses to register when APP_JWT_SECRET is missing', () => {
    const configService = { get: jest.fn().mockReturnValue(undefined) } as any;
    const authSigninService = {} as any;

    expect(() => new JwtStrategy(authSigninService, configService)).toThrow(
      /APP_JWT_SECRET is not configured/,
    );
  });
});
