import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class SalesTaxLiabilitySummaryQueryDto {
  @ApiProperty({
    description: 'Start date for the sales tax liability summary',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsOptional()
  fromDate: Date;

  @ApiProperty({
    description: 'End date for the sales tax liability summary',
    example: '2024-01-31',
  })
  @IsDateString()
  @IsOptional()
  toDate: Date;

  @ApiProperty({
    description: 'Accounting basis for the summary',
    enum: ['cash', 'accrual'],
    example: 'accrual',
  })
  @IsEnum(['cash', 'accrual'])
  @IsNotEmpty()
  basis: 'cash' | 'accrual';
}
