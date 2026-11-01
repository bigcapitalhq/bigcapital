import { ApiProperty } from '@nestjs/swagger';

export class SmsNotificationDetailsResponseDto {
  @ApiProperty({
    description: 'The display name of the customer.',
    example: 'Acme Corp',
  })
  customerName: string;

  @ApiProperty({
    description: 'The personal phone number of the customer.',
    example: '+1 555 123 4567',
  })
  customerPhoneNumber: string;

  @ApiProperty({
    description: 'The formatted SMS message.',
    example: 'Your receipt #R-00001 has been received.',
  })
  smsMessage: string;
}
