import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BillPaymentResponseDto } from './BillPaymentResponse.dto';
import { BillPaymentPageEntryDto } from './BillPaymentPageEntry.dto';

export class BillPaymentEditPageResponseDto {
  @ApiProperty({
    description: 'The bill payment details',
    type: BillPaymentResponseDto,
  })
  @Type(() => BillPaymentResponseDto)
  billPayment: BillPaymentResponseDto;

  @ApiProperty({
    description: 'The payable bill entries',
    type: [BillPaymentPageEntryDto],
  })
  @Type(() => BillPaymentPageEntryDto)
  entries: BillPaymentPageEntryDto[];
}
