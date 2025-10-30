import { UnauthorizedException } from '@nestjs/common';
import { ERRORS } from '../Auth.constants';

export class UserNotFoundException extends UnauthorizedException {
  constructor(identifier: string) {
    super({
      statusCode: 401,
      error: 'Unauthorized',
      message: `User not found: ${identifier}`,
      code: ERRORS.USER_NOT_FOUND,
    });
  }
}
