import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBankTransactionDto {
  @IsDate()
  date: Date;

  @IsString()
  transactionNumber: string;

  @IsString()
  referenceNo: string;

  @IsString()
  transactionType: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  exchangeRate: number;

  @IsString()
  currencyCode: string;

  @IsNumber()
  creditAccountId: number;

  @IsNumber()
  cashflowAccountId: number;

  @IsBoolean()
  publish: boolean;

  @IsOptional()
  @IsNumber()
  branchId?: number;

  @IsOptional()
  @IsString()
  plaidTransactionId?: string;

  @IsOptional()
  @IsString()
  plaidAccountId?: string;

  @IsOptional()
  @IsNumber()
  uncategorizedTransactionId?: number;
}
