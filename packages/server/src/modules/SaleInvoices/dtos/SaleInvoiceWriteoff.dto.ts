import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsOptional, ToNumber } from '@/common/decorators/Validators';

export class SaleInvoiceWriteoffDto {
  @ToNumber()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the bad debt expense account',
    example: 1024,
  })
  expenseAccountId: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description:
      'The date of the write-off. Defaults to the current date when omitted.',
    example: '2023-01-01',
  })
  date?: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(65535)
  @ApiProperty({
    description: 'The reason of writing off the invoice',
    example: 'Customer is bankrupt',
  })
  reason: string;
}
