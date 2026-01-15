import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  referenceId: string;
}
