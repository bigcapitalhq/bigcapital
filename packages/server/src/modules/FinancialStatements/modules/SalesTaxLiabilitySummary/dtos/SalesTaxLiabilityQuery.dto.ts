import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { AccountingBasis } from '@/common/types/AccountingBasis';

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
    enum: AccountingBasis,
    example: 'accrual',
  })
  @IsEnum(AccountingBasis)
  @IsNotEmpty()
  basis: AccountingBasis;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: NumberFormatQueryDto;
}
