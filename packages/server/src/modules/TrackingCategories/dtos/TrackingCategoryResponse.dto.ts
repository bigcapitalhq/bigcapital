import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TrackingCategoryOptionResponseDto {
  @ApiProperty({ description: 'Option ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Tracking category ID', example: 1 })
  categoryId: number;

  @ApiProperty({ description: 'Option name', example: 'North Store' })
  name: string;

  @ApiProperty({ description: 'Whether the option is active', example: true })
  active: boolean;

  @ApiPropertyOptional({ description: 'Created date' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Updated date' })
  updatedAt?: Date;
}

export class TrackingCategoryResponseDto {
  @ApiProperty({ description: 'Tracking category ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Category name', example: 'Location' })
  name: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Tracks the business location of transactions',
  })
  description?: string | null;

  @ApiProperty({ description: 'Whether the category is active', example: true })
  active: boolean;

  @ApiProperty({
    description: 'Tracking options',
    type: [TrackingCategoryOptionResponseDto],
  })
  options: TrackingCategoryOptionResponseDto[];

  @ApiPropertyOptional({ description: 'Created date' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Updated date' })
  updatedAt?: Date;
}

export class TrackingCategorySummaryResponseDto {
  @ApiProperty({ description: 'Tracking category ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Category name', example: 'Location' })
  name: string;

  @ApiProperty({ description: 'Whether the category is active', example: true })
  active: boolean;
}

export class TrackingCategoryOptionSummaryResponseDto {
  @ApiProperty({ description: 'Option ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Tracking category ID', example: 1 })
  categoryId: number;

  @ApiProperty({ description: 'Option name', example: 'North Store' })
  name: string;

  @ApiProperty({ description: 'Whether the option is active', example: true })
  active: boolean;
}

export class ManualJournalEntryTrackingCategoryResponseDto {
  @ApiProperty({ description: 'Tracking category ID', example: 1 })
  categoryId: number;

  @ApiProperty({ description: 'Tracking category option ID', example: 2 })
  optionId: number;

  @ApiPropertyOptional({
    description: 'Tracking category details',
    type: TrackingCategorySummaryResponseDto,
  })
  category?: TrackingCategorySummaryResponseDto;

  @ApiPropertyOptional({
    description: 'Tracking category option details',
    type: TrackingCategoryOptionSummaryResponseDto,
  })
  option?: TrackingCategoryOptionSummaryResponseDto;
}
