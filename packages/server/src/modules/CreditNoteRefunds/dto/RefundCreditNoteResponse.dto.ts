import { ApiProperty } from '@nestjs/swagger';

class RefundCreditNoteSummaryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'CN-0001' })
  creditNoteNumber: string;
}

class RefundCreditAccountDto {
  @ApiProperty({ example: 10 })
  id: number;

  @ApiProperty({ example: 'Cash on Hand' })
  name: string;
}

export class RefundCreditNoteResponseDto {
  @ApiProperty({ example: 100 })
  id: number;

  @ApiProperty({ example: '2024-01-15' })
  date: string;

  @ApiProperty({ example: '2024-01-15' })
  formattedDate: string;

  @ApiProperty({ example: 250 })
  amount: number;

  @ApiProperty({ example: '$250.00' })
  formttedAmount: string;

  @ApiProperty({ example: 'REF-001', required: false, nullable: true })
  referenceNo?: string | null;

  @ApiProperty({
    example: 'Refund issued to customer',
    required: false,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({ type: RefundCreditAccountDto })
  fromAccount: RefundCreditAccountDto;

  @ApiProperty({ type: RefundCreditNoteSummaryDto })
  creditNote: RefundCreditNoteSummaryDto;
}
