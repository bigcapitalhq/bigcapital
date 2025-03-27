import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommandRolePermissionDto)
  @MinLength(1)
  @ApiProperty({
    type: [CommandRolePermissionDto],
    description: 'The permissions of the role',
  })
  permissions: Array<CommandRolePermissionDto>;
}

export class CreateRoleDto extends CommandRoleDto {}
export class EditRoleDto extends CommandRoleDto {}
