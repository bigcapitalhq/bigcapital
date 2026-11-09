import { ApiProperty } from '@nestjs/swagger';
import { IsValidPassword } from '../password.policy';

export class AuthResetPasswordDto {
  @ApiProperty({
    example: 'new-password',
    description: 'New password',
  })
  @IsValidPassword()
  password: string;
}
