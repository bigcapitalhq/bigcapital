import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class WriteoffSaleInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The bad debt expense account id',
    example: 1024,
  })
  expenseAccountId: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description:
      'The write-off date. Defaults to today, or to the invoice date when the invoice is dated after today.',
    example: '2023-03-15',
  })
  date?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'The write-off reason (not stored).' })
  reason?: string;
}
