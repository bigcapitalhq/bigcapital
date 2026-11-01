import { ApiProperty } from '@nestjs/swagger';

export class PaymentReceiveMailResponseDto {
  @ApiProperty({
    description: 'Whether the mail was successfully queued/sent',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Optional status message',
    required: false,
  })
  message?: string;
}
