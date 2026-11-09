import { ApiProperty } from '@nestjs/swagger';

export class GetStripeConnectLinkResponseDto {
  @ApiProperty({
    description: 'Stripe OAuth2 Connect authorization URL',
    example:
      'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=...',
  })
  url: string;
}
