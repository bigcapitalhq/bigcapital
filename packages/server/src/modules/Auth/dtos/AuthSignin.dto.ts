import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSigninDto {
  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: true,
    description:
      'Whether to keep the user signed in for a longer period (remember me).',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
