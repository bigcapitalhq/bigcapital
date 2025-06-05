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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for categorizing bank transactions
 */
export class CategorizeBankTransactionDto {
  @ApiProperty({
    description: 'The date of the bank transaction',
    type: Date,
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: 'ID of the credit account associated with this transaction',
    type: Number,
    example: 1001,
  })
  @IsInt()
  @ToNumber()
  @IsNotEmpty()
  creditAccountId: number;

  @ApiPropertyOptional({
    description: 'Optional external reference number',
    type: String,
    example: 'REF-001',
  })
  @IsString()
  @IsOptional()
  referenceNo: string;

  @ApiPropertyOptional({
    description: 'Optional transaction number or reference',
    type: String,
    example: 'TRX-001',
  })
  @IsString()
  @IsOptional()
  transactionNumber: string;

  @ApiProperty({
    description: 'Type of bank transaction (e.g., deposit, withdrawal)',
    type: String,
    example: 'deposit',
  })
  @IsString()
  @IsNotEmpty()
  transactionType: string;

  @ApiPropertyOptional({
    description: 'Exchange rate for currency conversion',
    type: Number,
    default: 1,
    example: 1.15,
  })
  @IsNumber()
  @ToNumber()
  @IsOptional()
  exchangeRate: number = 1;

  @ApiPropertyOptional({
    description: 'Currency code for the transaction',
    type: String,
    example: 'USD',
  })
  @IsString()
  @IsOptional()
  currencyCode: string;

  @ApiPropertyOptional({
    description: 'Description of the bank transaction',
    type: String,
    example: 'Monthly rent payment',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    description: 'ID of the branch where the transaction occurred',
    type: Number,
    example: 101,
  })
  @IsNumber()
  @IsOptional()
  branchId: number;
}

/**
 * Extended DTO for categorizing bank transactions with IDs of uncategorized transactions
 */
export class CategorizeBankTransactionRouteDto extends CategorizeBankTransactionDto {
  @ApiProperty({
    description: 'Array of uncategorized transaction IDs to be categorized',
    type: [Number],
    example: [1001, 1002, 1003],
  })
  @IsArray()
  uncategorizedTransactionIds: Array<number>;
}
