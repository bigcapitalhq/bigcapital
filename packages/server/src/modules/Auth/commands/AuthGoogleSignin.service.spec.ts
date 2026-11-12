import { UnauthorizedException } from '@nestjs/common';
import { AuthGoogleSigninService } from './AuthGoogleSignin.service';
import { AuthSignupService } from './AuthSignup.service';

describe('AuthGoogleSigninService', () => {
  const profile = {
    id: 'google-123',
    emails: [{ value: 'User@Example.com', verified: true }],
    name: { givenName: 'Jane', familyName: 'Doe' },
  } as any;

  const createService = ({
    linkedUser,
    existingUser,
    updatedUser,
    createdUser,
  }: {
    linkedUser?: any;
    existingUser?: any;
    updatedUser?: any;
    createdUser?: any;
  }) => {
    const findOne = jest
      .fn()
      .mockImplementation((where: any) =>
        Promise.resolve('googleId' in where ? linkedUser : existingUser),
      );
    const patchAndFetchById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(updatedUser));
    const systemUserModel = {
      query: jest.fn(() => ({ findOne, patchAndFetchById })),
    } as any;
    const signUpWithGoogle = jest
      .fn()
      .mockImplementation(() => Promise.resolve(createdUser));
    const authSignupService = {
      signUpWithGoogle,
    } as unknown as AuthSignupService;

    const service = new AuthGoogleSigninService(
      systemUserModel,
      authSignupService,
    );
    return { service, findOne, patchAndFetchById, signUpWithGoogle };
  };

  it('returns the account already linked to the Google id', async () => {
    const user = { id: 1, active: true, googleId: profile.id };
    const { service, findOne, signUpWithGoogle } = createService({
      linkedUser: user,
    });

    await expect(service.validateGoogleProfile(profile)).resolves.toBe(user);
    expect(findOne).toHaveBeenCalledWith({ googleId: profile.id });
    expect(signUpWithGoogle).not.toHaveBeenCalled();
  });

  it('links the Google id to an existing account with the same email', async () => {
    const existingUser = { id: 2, active: true, email: 'user@example.com' };
    const updatedUser = { ...existingUser, googleId: profile.id };
    const { service, patchAndFetchById, signUpWithGoogle } = createService({
      existingUser,
      updatedUser,
    });

    await expect(service.validateGoogleProfile(profile)).resolves.toBe(
      updatedUser,
    );
    expect(patchAndFetchById).toHaveBeenCalledWith(2, {
      googleId: profile.id,
      verified: true,
      verifyToken: '',
    });
    expect(signUpWithGoogle).not.toHaveBeenCalled();
  });

  it('creates a new account through the signup service', async () => {
    const createdUser = { id: 3, active: true };
    const { service, signUpWithGoogle } = createService({ createdUser });

    await expect(service.validateGoogleProfile(profile)).resolves.toBe(
      createdUser,
    );
    expect(signUpWithGoogle).toHaveBeenCalledWith({
      googleId: profile.id,
      email: 'user@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
    });
  });

  it('rejects profiles without a verified email address', async () => {
    const { service, findOne } = createService({});

    await expect(
      service.validateGoogleProfile({
        ...profile,
        emails: [{ value: 'user@example.com', verified: false }],
      }),
    ).rejects.toThrow(UnauthorizedException);
    expect(findOne).not.toHaveBeenCalled();
  });

  it('rejects inactive accounts', async () => {
    const { service } = createService({
      linkedUser: { id: 4, active: false, googleId: profile.id },
    });

    await expect(service.validateGoogleProfile(profile)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
