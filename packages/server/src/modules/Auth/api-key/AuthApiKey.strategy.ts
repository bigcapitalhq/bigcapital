import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthApiKeyAuthorizeService } from '../commands/AuthApiKeyAuthorization.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'apiKey',
) {
  constructor(
    private readonly authApiKeyAuthorizeService: AuthApiKeyAuthorizeService,
  ) {
    super(
      {
        header: 'x-api-key',
        prefix: '',
      },
      false,
    );
  }

  validate(apiKey: string): unknown {
    return this.authApiKeyAuthorizeService.authorize(apiKey);
  }
}
