import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
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
}

export class MatchBankTransactionDto {
  @IsArray()
  @ArrayMinSize(1)
  uncategorizedTransactions: Array<number>

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