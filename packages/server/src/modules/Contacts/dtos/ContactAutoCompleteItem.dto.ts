import { ApiProperty } from '@nestjs/swagger';

export class ContactAutoCompleteItemDto {
  @ApiProperty({
    description: 'Contact id.',
    example: 12,
  })
  id: number;

  @ApiProperty({
    description: 'Display name of the contact (customer or vendor).',
    example: 'Acme Inc.',
  })
  displayName: string;

  @ApiProperty({
    description: 'Contact service type.',
    enum: ['customer', 'vendor'],
    example: 'vendor',
  })
  contactService: 'customer' | 'vendor';
}
