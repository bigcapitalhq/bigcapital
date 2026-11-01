import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';
import { INumberFormatQuery } from '../../types/Report.types';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';
import { ApiProperty } from '@nestjs/swagger';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import {
  TRIAL_BALANCE_COLUMN_KEYS,
  TrialBalanceColumnKey,
} from '../../common/constants/tableColumnKeys';
import { TrialBalanceSortOrder } from './TrialBalanceSheet.types';

export class TrialBalanceSheetQueryDto extends FinancialSheetBranchesQueryDto {
  @ApiProperty({
    description: 'Start date for the trial balance sheet',
    required: false,
    type: Date,
  })
  @IsDateString()
  @IsOptional()
  fromDate: Date;

  @ApiProperty({
    description: 'End date for the trial balance sheet',
    required: false,
    type: Date,
  })
  @IsDateString()
  @IsOptional()
  toDate: Date;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: INumberFormatQuery;

  @ApiProperty({
    description: 'Accounting basis for the report',
    required: false,
    enum: AccountingBasis,
  })
  @IsEnum(AccountingBasis)
  @IsOptional()
  basis: AccountingBasis;

  @ApiProperty({
    description: 'Filter out zero balance accounts',
    required: false,
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneZero: boolean;

  @ApiProperty({
    description: 'Filter out accounts with no transactions',
    required: false,
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneTransactions: boolean;

  @ApiProperty({
    description: 'Show only active accounts',
    required: false,
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  onlyActive: boolean;

  @ApiProperty({
    description: 'Filter by specific account IDs',
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  accountIds: number[];

  @ApiProperty({
    description: 'Column to sort the accounts by',
    required: false,
    enum: Object.values(TRIAL_BALANCE_COLUMN_KEYS),
  })
  @IsIn(Object.values(TRIAL_BALANCE_COLUMN_KEYS))
  @IsOptional()
  columnSortBy?: TrialBalanceColumnKey;

  @ApiProperty({
    description: 'Sort order for the accounts',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder?: TrialBalanceSortOrder;
}
