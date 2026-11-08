import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';
import {
  CUSTOM_FIELD_DATA_TYPES,
  CUSTOM_FIELD_RESOURCES,
  CustomFieldDataType,
  CustomFieldResource,
} from '../constants';

export class CreateCustomFieldDto {
  @ApiProperty({
    description: 'The resource/module the custom field belongs to.',
    example: 'Customer',
    enum: CUSTOM_FIELD_RESOURCES,
  })
  @IsIn(CUSTOM_FIELD_RESOURCES)
  resourceName: CustomFieldResource;

  @ApiProperty({
    description: 'Display label of the custom field.',
    example: 'Priority',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  label: string;

  @ApiProperty({
    description: 'The data type of the custom field.',
    example: CustomFieldDataType.Text,
    enum: CUSTOM_FIELD_DATA_TYPES,
  })
  @IsIn(CUSTOM_FIELD_DATA_TYPES)
  dataType: CustomFieldDataType;

  @ApiProperty({
    description: 'Help text displayed with the field.',
    required: false,
  })
  @IsOptional()
  @IsString()
  helpText?: string;

  @ApiProperty({
    description: 'Placeholder text displayed in the field.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  placeholder?: string;

  @ApiProperty({
    description: 'Whether the field is required.',
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  required?: boolean;

  @ApiProperty({
    description: 'Whether the field value must be unique.',
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  unique?: boolean;

  @ApiProperty({
    description: 'Whether the field is active.',
    required: false,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value, true))
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'Default value of the field.',
    required: false,
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' },
      { type: 'array', items: {} },
    ],
  })
  @IsOptional()
  @Allow()
  defaultValue?: unknown;

  @ApiProperty({
    description: 'Options for dropdown and multi-select fields.',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiProperty({
    description: 'A regular expression used to validate text values.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  inputFormat?: string;

  @ApiProperty({ required: false, description: 'Minimum text length.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minLength?: number;

  @ApiProperty({ required: false, description: 'Maximum text length.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxLength?: number;

  @ApiProperty({ required: false, description: 'Minimum numeric value.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minValue?: number;

  @ApiProperty({ required: false, description: 'Maximum numeric value.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxValue?: number;

  @ApiProperty({ required: false, description: 'Display order.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class EditCustomFieldDto {
  @ApiProperty({ required: false, description: 'Display label.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  label?: string;

  @ApiProperty({ required: false, description: 'Help text.' })
  @IsOptional()
  @IsString()
  helpText?: string;

  @ApiProperty({ required: false, description: 'Placeholder text.' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  placeholder?: string;

  @ApiProperty({
    required: false,
    description: 'Whether the field is required.',
  })
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  required?: boolean;

  @ApiProperty({ required: false, description: 'Whether the value is unique.' })
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  unique?: boolean;

  @ApiProperty({ required: false, description: 'Whether the field is active.' })
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value, true))
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    required: false,
    description: 'Default value.',
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' },
      { type: 'array', items: {} },
    ],
  })
  @IsOptional()
  @Allow()
  defaultValue?: unknown;

  @ApiProperty({
    required: false,
    description: 'Options for dropdown and multi-select fields.',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiProperty({ required: false, description: 'Regex input format.' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  inputFormat?: string;

  @ApiProperty({ required: false, description: 'Minimum text length.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minLength?: number;

  @ApiProperty({ required: false, description: 'Maximum text length.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxLength?: number;

  @ApiProperty({ required: false, description: 'Minimum numeric value.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minValue?: number;

  @ApiProperty({ required: false, description: 'Maximum numeric value.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxValue?: number;

  @ApiProperty({ required: false, description: 'Display order.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class GetCustomFieldsQueryDto {
  @ApiProperty({
    required: false,
    description: 'Filter by resource/module.',
    enum: CUSTOM_FIELD_RESOURCES,
  })
  @IsOptional()
  @IsIn(CUSTOM_FIELD_RESOURCES)
  resourceName?: CustomFieldResource;

  @ApiProperty({
    required: false,
    description: 'Include inactive custom fields.',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  includeInactive?: boolean;
}

export class UpdateCustomFieldStatusDto {
  @ApiProperty({ description: 'Whether the field is active.' })
  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  active: boolean;
}

export class ReorderCustomFieldItemDto {
  @ApiProperty({ description: 'Custom field ID.' })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Display order.' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder: number;
}

export class ReorderCustomFieldsDto {
  @ApiProperty({
    description: 'Custom field order items.',
    type: [ReorderCustomFieldItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReorderCustomFieldItemDto)
  orders: ReorderCustomFieldItemDto[];
}
