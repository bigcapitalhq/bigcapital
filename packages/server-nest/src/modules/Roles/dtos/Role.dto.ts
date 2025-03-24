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
  subject: string;

  @IsString()
  @IsNotEmpty()
  ability: string;

  @IsBoolean()
  @IsNotEmpty()
  value: boolean;

  @IsNumber()
  permissionId: number;
}

class CommandRoleDto {
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsString()
  @IsNotEmpty()
  roleDescription: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommandRolePermissionDto)
  @MinLength(1)
  permissions: Array<CommandRolePermissionDto>;
}

export class CreateRoleDto extends CommandRoleDto {}
export class EditRoleDto extends CommandRoleDto {}
