import { ApiProperty } from '@nestjs/swagger';

export class SettingItemDto {
  @ApiProperty({
    description: 'The setting key',
    example: 'invoices_from_name',
  })
  key: string;

  @ApiProperty({ description: 'The setting value', example: 'My Company' })
  value: string | boolean | number;

  @ApiProperty({ description: 'The settings group', example: 'sale_invoices' })
  group: string;
}
