import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CommandCustomFieldDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Resource name the custom field belongs to.', example: 'SaleInvoice' })
  resourceName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Internal field name.', example: 'cf_priority' })
  fieldName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Display label.', example: 'Priority' })
  label: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Field type.', example: 'dropdown' })
  fieldType: string;

  @IsObject()
  @IsOptional()
  @ApiProperty({ description: 'Field options (e.g., dropdown choices).', example: { choices: ['Low', 'Medium', 'High'] } })
  options?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value ?? false)
  @ApiProperty({ description: 'Whether the field is required.', example: false })
  required?: boolean;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ?? 0)
  @ApiProperty({ description: 'Display order.', example: 1 })
  order?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value ?? true)
  @ApiProperty({ description: 'Whether the field is active.', example: true })
  active?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Default value.', example: 'Medium' })
  defaultValue?: string;
}

export class CreateCustomFieldDto extends CommandCustomFieldDto {}
export class EditCustomFieldDto extends CommandCustomFieldDto {}
