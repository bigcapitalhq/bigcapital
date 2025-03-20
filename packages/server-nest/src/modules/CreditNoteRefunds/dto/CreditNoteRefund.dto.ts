import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { IsDate } from 'class-validator';
import { IsNumber } from 'class-validator';

export class CreditNoteRefundDto {
  @IsNumber()
  @IsNotEmpty()
  fromAccountId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  exchangeRate?: number;

  @IsString()
  @IsNotEmpty()
  referenceNo: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsOptional()
  branchId?: number;
}
