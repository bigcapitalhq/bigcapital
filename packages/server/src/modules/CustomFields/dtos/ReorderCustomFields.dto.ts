import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ReorderCustomFieldsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Resource name.', example: 'SaleInvoice' })
  resourceName: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'Ordered array of custom field IDs.', example: [3, 1, 2] })
  fieldIds: number[];
}
