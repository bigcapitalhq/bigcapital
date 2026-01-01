import { ApiProperty } from '@nestjs/swagger';
import { ToNumber, IsOptional } from '@/common/decorators/Validators';
import { IsDateString, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { IsDate } from 'class-validator';
import { IsNumber } from 'class-validator';

export class CreditNoteRefundDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the from account',
    example: 1,
  })
  @ApiProperty({
    description: 'The id of the from account',
    example: 1,
  })
  fromAccountId: number;

  @ToNumber()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The amount of the credit note refund',
    example: 100,
  })
  amount: number;

  @ToNumber()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: 'The exchange rate of the credit note refund',
    example: 1,
  })
  exchangeRate?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The reference number of the credit note refund',
    example: '123456',
  })
  referenceNo: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The description of the credit note refund',
    example: 'Credit note refund',
  })
  description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date of the credit note refund',
    example: '2021-01-01',
  })
  date: Date;

  @ToNumber()
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The id of the branch',
    example: 1,
  })
  branchId?: number;
}
