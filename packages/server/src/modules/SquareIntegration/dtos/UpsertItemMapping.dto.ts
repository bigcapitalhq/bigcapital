import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpsertItemMappingDto {
  @IsString()
  @ApiProperty({
    description: 'Square Catalog object id (ITEM or ITEM_VARIATION).',
  })
  squareCatalogObjectId: string;

  @IsString()
  @ApiProperty({ description: 'ITEM | ITEM_VARIATION' })
  squareObjectType: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  squareName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  squareSku?: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    description:
      'Bigcapital item id to map to. Null/omitted = "ignore" (Square sales of this item will resolve via default fallback).',
    required: false,
  })
  itemId?: number | null;
}
