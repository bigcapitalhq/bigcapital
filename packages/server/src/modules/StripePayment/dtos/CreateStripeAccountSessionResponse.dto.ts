import { ApiProperty } from '@nestjs/swagger';

export class CreateStripeAccountSessionResponseDto {
  @ApiProperty({
    description:
      'Stripe Account Session client secret for the Connect embedded component',
    example: 'acs_xxx_secret_xxx',
  })
  client_secret: string;
}
