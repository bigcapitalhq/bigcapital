import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { AccountingBasis } from '@/common/types/AccountingBasis';

export class TransactionsByReferenceQueryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The type of the reference (e.g., SaleInvoice, Bill, etc.)',
    example: 'SaleInvoice',
    required: true,
  })
  referenceType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the reference',
    example: '1',
    required: true,
  })
  referenceId: number;

  @ApiProperty({
    description: 'The accounting basis of the transactions',
    enum: AccountingBasis,
    example: AccountingBasis.Accrual,
    required: false,
  })
  @IsEnum(AccountingBasis)
  @IsOptional()
  basis: AccountingBasis;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: NumberFormatQueryDto;
}
