import { ToNumber } from '@/common/decorators/Validators';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBankTransactionDto {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsOptional()
  transactionNumber?: string;

  @IsString()
  @IsOptional()
  referenceNo?: string;

  @IsNotEmpty()
  @IsString()
  transactionType: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @ToNumber()
  @IsNumber()
  amount: number;

  @ToNumber()
  @IsNumber()
  exchangeRate: number = 1;

  @IsString()
  @IsOptional()
  currencyCode: string;

  @IsNotEmpty()
  @ToNumber()
  @IsInt()  
  creditAccountId: number;

  @IsNotEmpty()
  @ToNumber()
  @IsInt()  
  cashflowAccountId: number;

  @IsBoolean()
  @IsOptional()
  publish: boolean = true;

  @IsOptional()
  @ToNumber()
  @IsInt()
  branchId?: number;

  @IsOptional()
  @IsString()
  plaidTransactionId?: string;

  @IsOptional()
  @IsString()
  plaidAccountId?: string;

  @IsOptional()
  @IsInt()
  uncategorizedTransactionId?: number;
}
