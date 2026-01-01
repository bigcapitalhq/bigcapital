import { IsOptional, ToNumber } from '@/common/decorators/Validators';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, Min } from 'class-validator';
import { IsString } from 'class-validator';
import { IsDate } from 'class-validator';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class RefundVendorCreditDto {
  @ToNumber()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty({
    description: 'The amount of the refund',
    example: 100,
  })
  amount: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty({
    description: 'The exchange rate of the refund',
    example: 1,
  })
  exchangeRate?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    description: 'The id of the deposit account',
    example: 1,
  })
  depositAccountId: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the refund',
    example: 'Refund for vendor credit',
  })
  description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date of the refund',
    example: '2021-01-01',
  })
  date: Date;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: 'The id of the branch',
    example: 1,
  })
  branchId?: number;
}
