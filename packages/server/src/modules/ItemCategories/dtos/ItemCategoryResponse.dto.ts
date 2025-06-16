import { ApiProperty } from '@nestjs/swagger';

export class ItemCategoryResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the item category',
  })
  id: number;

  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the item category',
  })
  name: string;

  @ApiProperty({
    example: 'Electronic devices and accessories',
    description: 'The description of the item category',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'The cost account ID',
    required: false,
  })
  costAccountId?: number;

  @ApiProperty({
    example: 1,
    description: 'The sell account ID',
    required: false,
  })
  sellAccountId?: number;

  @ApiProperty({
    example: 1,
    description: 'The inventory account ID',
    required: false,
  })
  inventoryAccountId?: number;

  @ApiProperty({
    example: 'FIFO',
    description: 'The cost method',
    required: false,
  })
  costMethod?: string;

  @ApiProperty({
    example: 1,
    description: 'The user ID who created the category',
  })
  userId: number;

  @ApiProperty({
    example: '2024-03-20T10:00:00Z',
    description: 'The creation date of the category',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-20T10:00:00Z',
    description: 'The last update date of the category',
  })
  updatedAt: Date;

  @ApiProperty({
    example: 5,
    description: 'The number of items in this category',
  })
  count?: number;
}
