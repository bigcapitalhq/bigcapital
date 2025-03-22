import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { IsDate } from 'class-validator';
import { IsNumber } from 'class-validator';

export class CreditNoteRefundDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the from account',
    example: 1,
  })
  fromAccountId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The amount of the credit note refund',
    example: 100,
  })
  amount: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: 'The exchange rate of the credit note refund',
    example: 1,
  })
  exchangeRate?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The reference number of the credit note refund',
    example: '123456',
  })
  referenceNo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the credit note refund',
    example: 'Credit note refund',
  })
  description: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date of the credit note refund',
    example: '2021-01-01',
  })
  date: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The id of the branch',
    example: 1,
  })
  branchId?: number;
}
