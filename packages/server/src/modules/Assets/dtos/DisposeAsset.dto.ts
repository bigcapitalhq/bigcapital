import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class DisposeAssetDto {
  @IsDateString()
  @ApiProperty({
    description: 'Disposal date',
    example: '2024-12-31',
  })
  disposalDate: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Disposal proceeds (sale amount)',
    example: 500.00,
  })
  disposalProceeds: number;

  @IsEnum(['disposed', 'sold'])
  @ApiProperty({
    description: 'Disposal status',
    example: 'sold',
    enum: ['disposed', 'sold'],
  })
  status: 'disposed' | 'sold';

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @ApiProperty({
    description: 'Disposal notes',
    example: 'Sold to third party',
    required: false,
  })
  disposalNotes?: string;
}
