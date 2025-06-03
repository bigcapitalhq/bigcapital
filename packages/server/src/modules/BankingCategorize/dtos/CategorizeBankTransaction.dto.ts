import { ToNumber } from '@/common/decorators/Validators';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CategorizeBankTransactionDto {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsInt()
  @ToNumber()
  @IsNotEmpty()
  creditAccountId: number;

  @IsString()
  @IsOptional()
  referenceNo: string;

  @IsString()
  @IsOptional()
  transactionNumber: string;

  @IsString()
  @IsNotEmpty()
  transactionType: string;

  @IsNumber()
  @ToNumber()
  @IsOptional()
  exchangeRate: number = 1;

  @IsString()
  @IsOptional()
  currencyCode: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  branchId: number;
}

export class CategorizeBankTransactionRouteDto extends CategorizeBankTransactionDto {
  @IsArray()
  uncategorizedTransactionIds: Array<number>;
}
