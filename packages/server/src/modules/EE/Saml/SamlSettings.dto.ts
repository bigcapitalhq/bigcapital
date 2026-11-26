import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength } from 'class-validator';

export class UpdateSamlSettingsDto {
  @ApiProperty({
    description: 'Allow members to sign in through this identity provider.',
  })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    description: 'Entity ID (issuer) from the identity provider.',
  })
  @IsString()
  @MaxLength(2048)
  idpEntityId: string;

  @ApiProperty({
    description: 'HTTPS single sign-on URL for the HTTP-Redirect binding.',
  })
  @IsString()
  @MaxLength(2048)
  idpSsoUrl: string;

  @ApiProperty({
    description: 'The identity provider signing certificate in PEM format.',
  })
  @IsString()
  @MaxLength(32768)
  idpCertificate: string;
}

export class SamlSettingsResponseDto extends UpdateSamlSettingsDto {
  @ApiProperty()
  organizationId: string;

  @ApiProperty({ description: 'Service provider entity ID.' })
  entityId: string;

  @ApiProperty({
    description: 'Assertion Consumer Service URL for the HTTP-POST binding.',
  })
  acsUrl: string;
}
