import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaymentReceivedResponseDto } from './PaymentReceivedResponse.dto';
import { PaymentReceivePageEntryDto } from './PaymentReceivePageEntry.dto';

export class PaymentReceiveEditPageResponseDto {
  @ApiProperty({
    description: 'The payment received details',
    type: PaymentReceivedResponseDto,
  })
  @Type(() => PaymentReceivedResponseDto)
  data: PaymentReceivedResponseDto;

  @ApiProperty({
    description: 'The receivable invoice entries',
    type: [PaymentReceivePageEntryDto],
  })
  @Type(() => PaymentReceivePageEntryDto)
  entries: PaymentReceivePageEntryDto[];
}
