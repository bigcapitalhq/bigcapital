import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import {
  MFA_METHOD_IDS,
  MfaMethodId,
  MfaMethodKind,
} from '../two-factor/methods/MfaMethod.types';

export class MfaMethodDescriptorDto {
  @ApiProperty({ enum: MFA_METHOD_IDS })
  id: MfaMethodId;

  @ApiProperty({ enum: ['otp', 'recovery_code', 'webauthn'] })
  kind: MfaMethodKind;
}

export class MfaChallengeDto {
  @ApiProperty({ description: 'Single-use token of the second step.' })
  challengeToken: string;

  @ApiProperty({ description: 'Seconds until the challenge token expires.' })
  expiresIn: number;

  @ApiProperty({ enum: ['verify', 'setup'] })
  purpose: 'verify' | 'setup';

  @ApiProperty({
    description: 'Methods the user can use for this challenge.',
    type: [MfaMethodDescriptorDto],
  })
  methods: MfaMethodDescriptorDto[];

  @ApiProperty({ enum: MFA_METHOD_IDS, required: false })
  defaultMethod?: MfaMethodId;
}

export class MfaVerifyDto {
  @ApiProperty({
    description: 'The challenge token returned by POST /auth/signin.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  challengeToken: string;

  @ApiProperty({ enum: MFA_METHOD_IDS })
  @IsIn([...MFA_METHOD_IDS])
  method: MfaMethodId;

  @ApiProperty({
    description: '6-digit code from the authenticator app or email.',
    example: '123456',
    required: false,
  })
  @ValidateIf((dto) => dto.method === 'totp' || dto.method === 'email_otp')
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  code?: string;

  @ApiProperty({
    description: 'One of the recovery codes, instead of `code`.',
    example: 'k7m2-q9xd-3fha-p8tw',
    required: false,
  })
  @ValidateIf((dto) => dto.method === 'recovery_code')
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  recoveryCode?: string;
}

export class MfaPrepareDto {
  @ApiProperty({
    description: 'The challenge token returned by POST /auth/signin.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  challengeToken: string;

  @ApiProperty({ enum: MFA_METHOD_IDS })
  @IsIn([...MFA_METHOD_IDS])
  method: MfaMethodId;
}

export class MfaPrepareResponseDto {
  @ApiProperty({ enum: MFA_METHOD_IDS })
  method: MfaMethodId;

  @ApiProperty({ description: 'The method is ready for its credential.' })
  ready: boolean;
}

export class MfaSetupStartDto {
  @ApiProperty({
    description: 'The challenge token returned by POST /auth/signin.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  challengeToken: string;

  @ApiProperty({ enum: MFA_METHOD_IDS, required: false })
  @IsOptional()
  @IsIn([...MFA_METHOD_IDS])
  method?: MfaMethodId;
}

export class MfaSetupConfirmDto extends MfaSetupStartDto {
  @ApiProperty({
    description: '6-digit code from the authenticator app.',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  code: string;
}
