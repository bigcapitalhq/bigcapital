import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CommandRolePermissionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'subject',
    description: 'The subject of the permission',
  })
  subject: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'read',
    description: 'The action of the permission',
  })
  ability: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'The value of the permission',
  })
  value: boolean;
}

export class CreateRolePermissionDto extends CommandRolePermissionDto { }
export class EditRolePermissionDto extends CommandRolePermissionDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'The permission ID',
  })
  permissionId: number;
}

class CommandRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'admin',
    description: 'The name of the role',
  })
  roleName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Administrator',
    description: 'The description of the role',
  })
  roleDescription: string;
}

export class CreateRoleDto extends CommandRoleDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CommandRolePermissionDto)
  @ApiProperty({
    type: [CommandRolePermissionDto],
    description: 'The permissions of the role',
  })
  permissions: Array<CreateRolePermissionDto>;
}

export class EditRoleDto extends CommandRoleDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EditRolePermissionDto)
  @ApiProperty({
    type: [EditRolePermissionDto],
    description: 'The permissions of the role',
  })
  permissions: Array<EditRolePermissionDto>;
}
