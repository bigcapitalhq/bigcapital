import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

class RoleAbilityResponseDto {
  @ApiProperty({
    description: 'The subject of the ability',
    example: 'all',
  })
  subject: string;

  @ApiProperty({
    description: 'The action permitted for the subject',
    example: 'manage',
  })
  action: string;
}

class DashboardFeatureResponseDto {
  @ApiProperty({
    description: 'The name of the feature',
    example: 'warehouses',
  })
  name: string;

  @ApiProperty({
    description: 'Whether the feature is accessible for the tenant',
    example: true,
  })
  isAccessible: boolean;

  @ApiProperty({
    description: 'The default accessibility of the feature',
    example: false,
  })
  defaultAccessible: boolean;
}

@ApiExtraModels(RoleAbilityResponseDto, DashboardFeatureResponseDto)
export class GetDashboardBootMetaResponseDto {
  @ApiProperty({
    description: 'List of abilities for the current user',
    type: [RoleAbilityResponseDto],
    example: [
      { subject: 'all', action: 'manage' },
      { subject: 'invoices', action: 'read' },
    ],
  })
  abilities: RoleAbilityResponseDto[];

  @ApiProperty({
    description: 'List of features and their accessibility',
    type: [DashboardFeatureResponseDto],
    example: [
      { name: 'warehouses', isAccessible: true, defaultAccessible: false },
      { name: 'branches', isAccessible: false, defaultAccessible: false },
    ],
  })
  features: DashboardFeatureResponseDto[];

  @ApiProperty({
    description: 'Whether the app is running on Bigcapital Cloud',
    example: true,
  })
  isBigcapitalCloud: boolean;
}
