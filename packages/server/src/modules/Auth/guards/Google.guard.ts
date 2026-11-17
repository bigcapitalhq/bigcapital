import {
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { buildUrlWithQuery } from '../Auth.utils';
import { ERRORS } from '../Auth.constants';

/**
 * Passport reports OAuth errors (e.g. `access_denied`) as short snake_case
 * codes. Anything else is a free-form message that must not be exposed.
 */
const OAUTH_ERROR_CODE_PATTERN = /^[a-z0-9_]{1,64}$/i;

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleAuthGuard.name);

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

      if (err) {
        this.logger.warn(
          `Google authentication failed: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
      if (!response.headersSent) {
        response.redirect(
          buildUrlWithQuery(failureRedirectUrl, {
            error: this.resolveFailureReason(err, info),
          }),
        );
      }
      return null;
    }
    return user;
  }

  /**
   * Returns a short, safe error code for the redirect URL.
   *
   * Unexpected errors (such as database failures) are never echoed back,
   * because their messages can contain internal details like SQL statements.
   * They are logged instead and reported as `google_auth_failed`.
   */
  private resolveFailureReason(err: any, info: any): string {
    if (err instanceof HttpException) {
      const body = err.getResponse();
      const errorType =
        typeof body === 'object' && body !== null
          ? (body as { errors?: Array<{ type?: string }> }).errors?.[0]?.type
          : undefined;

      return errorType === ERRORS.USER_INACTIVE
        ? 'account_inactive'
        : 'google_auth_failed';
    }
    const infoMessage = info?.message;

    if (
      !err &&
      typeof infoMessage === 'string' &&
      OAUTH_ERROR_CODE_PATTERN.test(infoMessage)
    ) {
      return infoMessage;
    }
    return 'google_auth_failed';
  }
}
