import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

class CommandBranchDto {
  @ApiProperty({ description: 'Branch name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Branch code' })
  @IsOptional()
  @IsBoolean()
  primary?: boolean;

  @ApiPropertyOptional({ description: 'Branch code' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Branch address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Branch city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Branch country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Branch phone number' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional({ description: 'Branch email' })
  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Branch website' })
  @IsOptional()
  @IsUrl()
  @IsString()
  website?: string;
}

export class CreateBranchDto extends CommandBranchDto {}
export class EditBranchDto extends CommandBranchDto {}
