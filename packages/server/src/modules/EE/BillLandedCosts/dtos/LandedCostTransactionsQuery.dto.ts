import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LandedCostTransactionType } from '../types/BillLandedCosts.types';

export class LandedCostTransactionsQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['Expense', 'Bill'])
  transactionType: LandedCostTransactionType;

  @IsDateString()
  @IsOptional()
  date: string;
}
