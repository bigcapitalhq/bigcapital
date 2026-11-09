import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthGoogleSigninService } from '../commands/AuthGoogleSignin.service';
import { GoogleOAuthStateStore } from './GoogleOAuthState.store';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    stateStore: GoogleOAuthStateStore,
    private readonly authGoogleSigninService: AuthGoogleSigninService,
  ) {
    super({
      // The strategy is always registered so the application can boot with
      // Google sign-in disabled. The route guard prevents its use in that case.
      clientID: configService.get<string>('google.clientId') || 'disabled',
      clientSecret:
        configService.get<string>('google.clientSecret') || 'disabled',
      callbackURL: configService.get<string>('google.callbackUrl'),
      scope: ['openid', 'email', 'profile'],
      state: true,
      store: stateStore,
    } as any);
  }

  public validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    return this.authGoogleSigninService.validateGoogleProfile(profile);
  }
}
