import { ApiProperty } from '@nestjs/swagger';

export class CustomFieldResponseDto {
  @ApiProperty({ description: 'Custom field ID.', example: 1 })
  id: number;

  @ApiProperty({ description: 'Resource name.', example: 'SaleInvoice' })
  resourceName: string;

  @ApiProperty({ description: 'Field name.', example: 'cf_priority' })
  fieldName: string;

  @ApiProperty({ description: 'Display label.', example: 'Priority' })
  label: string;

  @ApiProperty({ description: 'Field type.', example: 'dropdown' })
  fieldType: string;

  @ApiProperty({ description: 'Field options.', example: { choices: ['Low', 'Medium', 'High'] } })
  options?: Record<string, any>;

  @ApiProperty({ description: 'Whether the field is required.', example: false })
  required: boolean;

  @ApiProperty({ description: 'Display order.', example: 1 })
  order: number;

  @ApiProperty({ description: 'Whether the field is active.', example: true })
  active: boolean;

  @ApiProperty({ description: 'Default value.', example: 'Medium' })
  defaultValue?: string;

  @ApiProperty({ description: 'Created at timestamp.' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp.' })
  updatedAt: Date;
}
