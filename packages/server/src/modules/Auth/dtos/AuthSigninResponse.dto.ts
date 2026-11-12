import { ApiProperty } from '@nestjs/swagger';
import { MfaChallengeDto, MfaMethodDescriptorDto } from './MfaSignin.dto';

export class AuthSigninResponseDto {
  @ApiProperty({
    description:
      'JWT access token. Missing when a second step is needed (two_factor_required or two_factor_setup_required).',
    required: false,
  })
  accessToken?: string;

  @ApiProperty({ description: 'Organization ID', required: false })
  organizationId?: string;

  @ApiProperty({ description: 'Tenant ID', required: false })
  tenantId?: number;

  @ApiProperty({ description: 'User ID', required: false })
  userId?: number;

  @ApiProperty({
    description:
      'The user has two-factor authentication: send a code with the challenge token to POST /auth/signin/2fa.',
    required: false,
  })
  twoFactorRequired?: boolean;

  @ApiProperty({
    description:
      'The organization requires two-factor authentication and the user has not set it up: set it up with POST /auth/signin/2fa/setup and /auth/signin/2fa/setup/confirm.',
    required: false,
  })
  twoFactorSetupRequired?: boolean;

  @ApiProperty({
    description: 'Single-use token of the second step.',
    required: false,
  })
  challengeToken?: string;

  @ApiProperty({
    description: 'Seconds until the challenge token expires.',
    required: false,
  })
  challengeExpiresIn?: number;

  @ApiProperty({
    description:
      'The second step to complete, with the methods the user can choose from. Missing when the sign-in is complete.',
    type: MfaChallengeDto,
    required: false,
  })
  mfa?: MfaChallengeDto;

  @ApiProperty({
    description:
      'Methods available for the second step (deprecated, use mfa.methods).',
    type: [MfaMethodDescriptorDto],
    required: false,
  })
  availableMethods?: MfaMethodDescriptorDto[];

  @ApiProperty({
    description:
      'The method to show first (deprecated, use mfa.defaultMethod).',
    required: false,
  })
  defaultMethod?: string;
}

export class AuthSigninSetupConfirmResponseDto extends AuthSigninResponseDto {
  @ApiProperty({
    description: 'The new single-use recovery codes. Shown once.',
    type: [String],
  })
  recoveryCodes: string[];
}
