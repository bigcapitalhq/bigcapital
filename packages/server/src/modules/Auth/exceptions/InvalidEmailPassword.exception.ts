import { UnauthorizedException } from '@nestjs/common';
import { ERRORS } from '../Auth.constants';

export class InvalidEmailPasswordException extends UnauthorizedException {
  constructor(email: string) {
    super({
      statusCode: 401,
      error: 'Unauthorized',
      message: `Invalid email or password for ${email}`,
      code: ERRORS.INVALID_DETAILS,
    });
  }
}


