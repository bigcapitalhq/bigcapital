import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// RolePermissionResponseDto
export class RolePermissionResponseDto {
  @ApiProperty({
    example: 'read',
    description: 'The action/ability of the permission',
  })
  ability: string;

  @ApiProperty({
    example: 'item',
    description: 'The subject of the permission',
  })
  subject: string;

  @ApiProperty({
    example: true,
    description: 'The value of the permission',
  })
  value: boolean;
}

@ApiExtraModels(RolePermissionResponseDto)
export class RoleResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier of the role',
  })
  id: number;

  @ApiProperty({
    example: 'admin',
    description: 'The slug of the role',
  })
  slug: string;

  @ApiProperty({
    example: 'Administrator',
    description: 'The name of the role',
  })
  name: string;

  @ApiProperty({
    example: 'Administrator role with all permissions',
    description: 'The description of the role',
  })
  description: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if the role is predefined',
  })
  predefined: boolean;

  @ApiProperty({
    type: [RolePermissionResponseDto],
    description: 'List of permissions associated with the role',
    example: [
      { ability: 'read', subject: 'item', value: true },
      { ability: 'edit', subject: 'item', value: false },
    ],
  })
  @Type(() => RolePermissionResponseDto)
  permissions: RolePermissionResponseDto[];
}
