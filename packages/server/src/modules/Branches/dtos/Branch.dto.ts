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
  @ApiProperty({
    description: 'Branch name',
    example: 'Main Branch',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Whether this is the primary branch',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  primary?: boolean;

  @ApiPropertyOptional({
    description: 'Branch code',
    example: 'BR001',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: 'Branch address',
    example: '123 Main Street',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Branch city',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Branch country',
    example: 'USA',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Branch phone number',
    example: '+1-555-123-4567',
  })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional({
    description: 'Branch email',
    example: 'branch@example.com',
  })
  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Branch website',
    example: 'https://www.example.com/branch',
  })
  @IsOptional()
  @IsUrl()
  @IsString()
  website?: string;
}

export class CreateBranchDto extends CommandBranchDto {}
export class EditBranchDto extends CommandBranchDto {}
