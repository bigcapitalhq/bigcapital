import { ApiProperty } from '@nestjs/swagger';

export class WarehouseResponseDto {
  @ApiProperty({
    description: 'The name of the warehouse',
    example: 'Main Warehouse',
  })
  name!: string;

  @ApiProperty({
    description: 'The unique code identifier for the warehouse',
    example: 'WH-001',
  })
  code!: string;

  @ApiProperty({
    description: 'The city where the warehouse is located',
    example: 'New York',
  })
  city!: string;

  @ApiProperty({
    description: 'The country where the warehouse is located',
    example: 'United States',
  })
  country!: string;

  @ApiProperty({
    description: 'The full address of the warehouse',
    example: '123 Warehouse Street, New York, NY 10001',
  })
  address!: string;

  @ApiProperty({
    description: 'Indicates if this is the primary warehouse',
    example: true,
  })
  primary!: boolean;
}
