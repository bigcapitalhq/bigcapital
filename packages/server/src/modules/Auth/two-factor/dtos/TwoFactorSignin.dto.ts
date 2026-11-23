import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class TwoFactorSigninDto {
  @ApiProperty({
    description: 'The challenge token returned by POST /auth/signin.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  challengeToken: string;

  @ApiProperty({
    description: '6-digit code from the authenticator app.',
    example: '123456',
    required: false,
  })
  @ValidateIf((dto) => !dto.recoveryCode)
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  code?: string;

  @ApiProperty({
    description: 'One of the recovery codes, instead of `code`.',
    example: 'k7m2-q9xd-3fha-p8tw',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  recoveryCode?: string;
}

export class TwoFactorSigninSetupDto {
  @ApiProperty({
    description:
      'The challenge token returned by POST /auth/signin with two_factor_setup_required.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  challengeToken: string;
}

export class TwoFactorSigninSetupConfirmDto extends TwoFactorSigninSetupDto {
  @ApiProperty({
    description: '6-digit code from the authenticator app.',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  code: string;
}
