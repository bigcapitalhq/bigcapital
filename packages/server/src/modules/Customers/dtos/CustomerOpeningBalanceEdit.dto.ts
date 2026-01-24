import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ToNumber } from '@/common/decorators/Validators';

export class CustomerOpeningBalanceEditDto {
  @ApiProperty({
    required: true,
    description: 'Opening balance',
    example: 5000.0,
  })
  @IsNumber()
  @IsNotEmpty()
  @ToNumber()
  openingBalance: number;

  @ApiProperty({
    required: false,
    description: 'Opening balance date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  openingBalanceAt?: string;

  @ApiProperty({
    required: false,
    description: 'Opening balance exchange rate',
    example: 1.0,
  })
  @IsOptional()
  @IsNumber()
  @ToNumber()
  openingBalanceExchangeRate?: number;

  @ApiProperty({
    required: false,
    description: 'Opening balance branch ID',
    example: 101,
  })
  @IsOptional()
  @IsNumber()
  @ToNumber()
  openingBalanceBranchId?: number;
}
