import { ApiProperty } from '@nestjs/swagger';
import {
  CUSTOM_FIELD_DATA_TYPES,
  CUSTOM_FIELD_RESOURCES,
  CustomFieldDataType,
  CustomFieldResource,
} from '../constants';

export class CustomFieldResponseDto {
  @ApiProperty({ description: 'Custom field ID.' })
  id: number;

  @ApiProperty({
    description: 'Resource/module name.',
    example: 'Customer',
    enum: CUSTOM_FIELD_RESOURCES,
  })
  resourceName: CustomFieldResource;

  @ApiProperty({ description: 'API field name.', example: 'cf_priority' })
  fieldName: string;

  @ApiProperty({ description: 'Display label.', example: 'Priority' })
  label: string;

  @ApiProperty({
    description: 'Data type.',
    example: 'text',
    enum: CUSTOM_FIELD_DATA_TYPES,
  })
  dataType: CustomFieldDataType;

  @ApiProperty({ required: false, description: 'Help text.' })
  helpText?: string;

  @ApiProperty({ required: false, description: 'Placeholder text.' })
  placeholder?: string;

  @ApiProperty({ description: 'Whether the field is required.' })
  required: boolean;

  @ApiProperty({ description: 'Whether the field value is unique.' })
  unique: boolean;

  @ApiProperty({ description: 'Whether the field is active.' })
  active: boolean;

  @ApiProperty({ required: false, description: 'Default value.' })
  defaultValue?: unknown;

  @ApiProperty({
    required: false,
    description: 'Options for dropdown and multi-select fields.',
    type: [String],
  })
  options?: string[];

  @ApiProperty({ required: false, description: 'Regex input format.' })
  inputFormat?: string;

  @ApiProperty({ required: false, description: 'Minimum text length.' })
  minLength?: number;

  @ApiProperty({ required: false, description: 'Maximum text length.' })
  maxLength?: number;

  @ApiProperty({ required: false, description: 'Minimum numeric value.' })
  minValue?: number;

  @ApiProperty({ required: false, description: 'Maximum numeric value.' })
  maxValue?: number;

  @ApiProperty({ description: 'Display order.' })
  sortOrder: number;

  @ApiProperty({
    required: false,
    description: 'Number of stored values.',
    example: 12,
  })
  valuesCount?: number;

  @ApiProperty({ description: 'Created at timestamp.' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp.' })
  updatedAt: Date;
}

export class CustomFieldsListResponseDto {
  @ApiProperty({
    description: 'Custom fields list.',
    type: [CustomFieldResponseDto],
  })
  data: CustomFieldResponseDto[];
}
