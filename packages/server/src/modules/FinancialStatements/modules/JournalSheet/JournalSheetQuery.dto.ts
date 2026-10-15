import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';

export class JournalSheetQueryDto extends FinancialSheetBranchesQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for the journal sheet',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsOptional()
  fromDate: Date | string;

  @ApiPropertyOptional({
    description: 'End date for the journal sheet',
    example: '2024-01-31',
  })
  @IsDateString()
  @IsOptional()
  toDate: Date | string;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: NumberFormatQueryDto;

  @ApiPropertyOptional({
    description: 'Type of transaction to filter',
    example: 'payment',
  })
  @IsString()
  @IsOptional()
  transactionType: string;

  @ApiPropertyOptional({
    description: 'ID of the transaction to filter',
    example: 'TXN-12345',
  })
  @IsString()
  @IsOptional()
  transactionId: string;

  @ApiPropertyOptional({
    description: 'Array of account IDs to filter',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsOptional()
  accountsIds: number | number[];

  @ApiPropertyOptional({
    description: 'Start range for filtering',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  fromRange: number;

  @ApiPropertyOptional({
    description: 'End range for filtering',
    example: 200,
  })
  @IsNumber()
  @IsOptional()
  toRange: number;
}
