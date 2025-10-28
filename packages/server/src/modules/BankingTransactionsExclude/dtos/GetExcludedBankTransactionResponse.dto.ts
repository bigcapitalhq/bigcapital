import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator';

@ApiExtraModels()
export class GetExcludedBankTransactionResponseDto {
  @ApiProperty({
    description:
      'Transaction amount (positive for deposit, negative for withdrawal)',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Transaction date (ISO string or Date)' })
  @IsDateString()
  date: string | Date;

  @ApiProperty({ description: 'ID of the associated bank account' })
  @IsNumber()
  accountId: number;

  @ApiProperty({
    description: 'Reference number for the transaction',
    required: false,
  })
  @IsString()
  @IsOptional()
  referenceNo?: string;

  @ApiProperty({ description: 'Payee name', required: false })
  @IsString()
  @IsOptional()
  payee?: string;

  @ApiProperty({ description: 'Transaction description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Plaid transaction ID', required: false })
  @IsString()
  @IsOptional()
  plaidTransactionId?: string;

  @ApiProperty({
    description: 'Whether the transaction is pending',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  pending?: boolean;

  @ApiProperty({
    description: 'ID of the recognized transaction, if any',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  recognizedTransactionId?: number;

  @ApiProperty({
    description: 'Categorization reference type',
    required: false,
  })
  @IsString()
  @IsOptional()
  categorizeRefType?: string;

  @ApiProperty({ description: 'Categorization reference ID', required: false })
  @IsNumber()
  @IsOptional()
  categorizeRefId?: number;

  @ApiProperty({
    description: 'Formatted amount (localized string)',
    required: false,
  })
  @IsString()
  @IsOptional()
  formattedAmount?: string;

  @ApiProperty({ description: 'Formatted transaction date', required: false })
  @IsString()
  @IsOptional()
  formattedDate?: string;

  @ApiProperty({ description: 'Formatted deposit amount', required: false })
  @IsString()
  @IsOptional()
  formattedDepositAmount?: string;

  @ApiProperty({ description: 'Formatted withdrawal amount', required: false })
  @IsString()
  @IsOptional()
  formattedWithdrawalAmount?: string;

  @ApiProperty({ description: 'Withdrawal amount', required: false })
  @IsNumber()
  @IsOptional()
  withdrawal?: number;

  @ApiProperty({ description: 'Deposit amount', required: false })
  @IsNumber()
  @IsOptional()
  deposit?: number;

  @ApiProperty({ description: 'True if deposit transaction', required: false })
  @IsBoolean()
  @IsOptional()
  isDepositTransaction?: boolean;

  @ApiProperty({
    description: 'True if withdrawal transaction',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isWithdrawalTransaction?: boolean;

  @ApiProperty({
    description: 'True if transaction is recognized',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isRecognized?: boolean;

  @ApiProperty({
    description: 'True if transaction is excluded',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isExcluded?: boolean;

  @ApiProperty({
    description: 'True if transaction is pending',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPending?: boolean;

  // Recognized transaction fields (from transformer)
  @ApiProperty({
    description: 'Assigned account ID from recognized transaction',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  assignedAccountId?: number;

  @ApiProperty({
    description: 'Assigned account name from recognized transaction',
    required: false,
  })
  @IsString()
  @IsOptional()
  assignedAccountName?: string;

  @ApiProperty({
    description: 'Assigned account code from recognized transaction',
    required: false,
  })
  @IsString()
  @IsOptional()
  assignedAccountCode?: string;

  @ApiProperty({
    description: 'Assigned payee from recognized transaction',
    required: false,
  })
  @IsString()
  @IsOptional()
  assignedPayee?: string;

  @ApiProperty({
    description: 'Assigned memo from recognized transaction',
    required: false,
  })
  @IsString()
  @IsOptional()
  assignedMemo?: string;

  @ApiProperty({
    description: 'Assigned category from recognized transaction',
    required: false,
  })
  @IsString()
  @IsOptional()
  assignedCategory?: string;

  @ApiProperty({
    description: 'Assigned formatted category from recognized transaction',
    required: false,
  })
  @IsString()
  @IsOptional()
  assignedCategoryFormatted?: string;
}
