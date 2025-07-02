import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiKeyAuthGuard } from './AuthApiKey.guard';
import { getAuthApiKey } from '../Auth.utils';

// mixed-auth.guard.ts
@Injectable()
export class MixedAuthGuard implements CanActivate {
  constructor(
    private jwtGuard: JwtAuthGuard,
    private apiKeyGuard: ApiKeyAuthGuard,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const apiKey = getAuthApiKey(request.headers['authorization'] || '');

    if (apiKey) {
      return this.apiKeyGuard.canActivate(context);
    } else {
      return this.jwtGuard.canActivate(context);
    }
  }
}
