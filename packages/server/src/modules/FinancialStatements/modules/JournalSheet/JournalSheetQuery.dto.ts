import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

class JournalSheetNumberFormatQueryDto {
  @ApiPropertyOptional({
    description: 'Whether to hide cents in the number format',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  noCents: boolean;

  @ApiPropertyOptional({
    description: 'Whether to divide numbers by 1000',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  divideOn1000: boolean;
}

export class JournalSheetQueryDto extends FinancialSheetBranchesQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for the journal sheet',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  fromDate: Date | string;

  @ApiPropertyOptional({
    description: 'End date for the journal sheet',
    example: '2024-01-31T23:59:59.000Z',
  })
  @IsDateString()
  @IsOptional()
  toDate: Date | string;

  @ApiPropertyOptional({
    description: 'Number format options for the journal sheet',
    example: { noCents: false, divideOn1000: false },
  })
  @ValidateNested()
  @Type(() => JournalSheetNumberFormatQueryDto)
  numberFormat: JournalSheetNumberFormatQueryDto;

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
