import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MatchTransactionEntryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The type of the reference',
    example: 'SaleInvoice',
  })
  referenceType: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the reference',
    example: 1,
  })
  referenceId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description:
      'Sub-reference id within the reference record. Used for Expense to point at a specific expense_payment_splits row.',
    example: 42,
    required: false,
  })
  referenceSubId?: number;
}

export class MatchBankTransactionDto {
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Uncategorized transaction IDs to match',
    type: [Number],
    example: [1, 2],
  })
  uncategorizedTransactions: Array<number>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchTransactionEntryDto)
  @ApiProperty({
    description: 'The entries to match',
    example: [
      { referenceType: 'SaleInvoice', referenceId: 1 },
      { referenceType: 'SaleInvoice', referenceId: 2 },
    ],
  })
  matchedTransactions: MatchTransactionEntryDto[];
}