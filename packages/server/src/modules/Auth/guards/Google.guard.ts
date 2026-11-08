import {
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { buildUrlWithQuery } from '../Auth.utils';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  /**
   * Blocks the flow when Google sign-in is not configured.
   */
  public canActivate(context: ExecutionContext) {
    if (!this.configService.get<boolean>('google.enabled')) {
      throw new ServiceUnavailableException(
        'Google sign-in is not configured on this instance.',
      );
    }
    return super.canActivate(context);
  }

  /**
   * Always let the user pick which Google account to use.
   */
  public getAuthenticateOptions() {
    return { prompt: 'select_account' };
  }

  /**
   * Redirects back to the web app instead of throwing on OAuth failures.
   */
  public handleRequest<TUser = any>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      const response = context.switchToHttp().getResponse();
      const failureRedirectUrl = this.configService.get<string>(
        'google.failureRedirectUrl',
      );
      const reason = err?.message || info?.message || 'google_auth_failed';

      if (!response.headersSent) {
        response.redirect(
          buildUrlWithQuery(failureRedirectUrl, { error: reason }),
        );
      }
      return null;
    }
    return user;
  }
}
