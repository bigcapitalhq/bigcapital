import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

/**
 * Shared password validation applied to every password-creation/reset path
 * (signup, invite acceptance, reset). Keep it OUT of the signin DTO so users
 * with older shorter passwords can still log in.
 */
export function IsValidPassword() {
  return applyDecorators(
    IsString(),
    IsNotEmpty(),
    MinLength(PASSWORD_MIN_LENGTH),
    MaxLength(PASSWORD_MAX_LENGTH),
  );
}
