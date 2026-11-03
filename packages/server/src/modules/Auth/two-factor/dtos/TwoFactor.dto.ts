import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class TwoFactorConfirmSetupDto {
  @ApiProperty({
    description: '6-digit code from the authenticator app.',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  code: string;
}

/**
 * Password plus a second factor, for regenerating recovery codes and disabling.
 */
export class TwoFactorVerifyDto {
  @ApiProperty({ description: 'The current password of the user.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password: string;

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
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  recoveryCode?: string;
}

export class OrganizationTwoFactorDto {
  @ApiProperty({
    description:
      'Require two-factor authentication for every user of the organization.',
    example: true,
  })
  @IsBoolean()
  required: boolean;
}

export class TwoFactorStatusResponseDto {
  @ApiProperty({ description: 'Whether two-factor authentication is on.' })
  enabled: boolean;

  @ApiProperty({ description: 'When it was turned on.', nullable: true })
  enabledAt: Date | null;

  @ApiProperty({ description: 'Unused recovery codes left.' })
  recoveryCodesRemaining: number;

  @ApiProperty({ description: 'A setup was started and not confirmed yet.' })
  pendingSetup: boolean;
}

export class TwoFactorSetupResponseDto {
  @ApiProperty({
    description: 'The new secret, base32, for entering it by hand.',
    example: 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP',
  })
  secret: string;

  @ApiProperty({
    description: 'otpauth:// URI to show as a QR code.',
    example:
      'otpauth://totp/Bigcapital:user%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=Bigcapital&algorithm=SHA1&digits=6&period=30',
  })
  otpauthUrl: string;
}

export class TwoFactorRecoveryCodesResponseDto {
  @ApiProperty({
    description: 'New single-use recovery codes. Shown once.',
    type: [String],
  })
  recoveryCodes: string[];
}

export class OrganizationTwoFactorResponseDto {
  @ApiProperty({
    description: 'Whether the organization requires two-factor authentication.',
  })
  required: boolean;
}
