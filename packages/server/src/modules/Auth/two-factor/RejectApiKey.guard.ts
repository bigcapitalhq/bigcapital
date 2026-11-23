import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { getAuthApiKey } from '../Auth.utils';
import { TWO_FACTOR_ERRORS } from './TwoFactor.constants';

/**
 * Security settings (two-factor setup, disabling, the organization policy)
 * can only be changed from a signed-in session, never with an API key.
 */
@Injectable()
export class RejectApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (getAuthApiKey(request.headers?.['authorization'] || '')) {
      const message =
        'Two-factor settings cannot be changed with an API key, sign in instead.';
      throw new ForbiddenException({
        statusCode: 403,
        error: 'Forbidden',
        message,
        errors: [{ type: TWO_FACTOR_ERRORS.API_KEY_NOT_ALLOWED, message }],
      });
    }
    return true;
  }
}
