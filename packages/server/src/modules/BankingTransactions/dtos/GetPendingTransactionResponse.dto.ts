import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class GetPendingTransactionResponseDto {
  @ApiProperty({ description: 'Transaction amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Transaction date' })
  @IsDateString()
  date: Date | string;

  @ApiProperty({ description: 'Bank account ID' })
  @IsNumber()
  accountId: number;

  @ApiProperty({ description: 'Transaction reference number', required: false })
  @IsString()
  referenceNo: string;

  @ApiProperty({ description: 'Payee', required: false })
  @IsString()
  payee: string;

  @ApiProperty({ description: 'Transaction description', required: false })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Plaid transaction ID', required: false })
  @IsString()
  plaidTransactionId: string;

  @ApiProperty({ description: 'Recognized transaction ID', required: false })
  @IsNumber()
  recognizedTransactionId: number;

  @ApiProperty({ description: 'Is transaction pending?' })
  @IsBoolean()
  pending: boolean;

  @ApiProperty({ description: 'Transaction currency code' })
  @IsString()
  currencyCode: string;

  @ApiProperty({ description: 'Withdrawal amount' })
  @IsNumber()
  withdrawal: number;

  @ApiProperty({ description: 'Deposit amount' })
  @IsNumber()
  deposit: number;

  @ApiProperty({ description: 'Is deposit transaction?' })
  @IsBoolean()
  isDepositTransaction: boolean;

  @ApiProperty({ description: 'Is withdrawal transaction?' })
  @IsBoolean()
  isWithdrawalTransaction: boolean;

  @ApiProperty({ description: 'Formatted amount' })
  @IsString()
  formattedAmount: string;

  @ApiProperty({ description: 'Formatted date' })
  @IsString()
  formattedDate: string;

  @ApiProperty({ description: 'Formatted deposit amount' })
  @IsString()
  formattedDepositAmount: string;

  @ApiProperty({ description: 'Formatted withdrawal amount' })
  @IsString()
  formattedWithdrawalAmount: string;
}
