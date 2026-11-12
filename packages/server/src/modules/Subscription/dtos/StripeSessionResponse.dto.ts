import { ApiProperty } from '@nestjs/swagger';

export class StripeSessionResponseDto {
  @ApiProperty({
    description: 'The hosted Stripe URL to redirect the user to',
    example: 'https://checkout.stripe.com/c/pay/cs_test_xxx',
  })
  url: string;
}

export class StripeCheckoutSessionResponseDto extends StripeSessionResponseDto {
  @ApiProperty({
    description: 'Stripe Checkout Session id',
    example: 'cs_test_xxx',
  })
  sessionId: string;
}

export class StripeSyncCheckoutSessionResponseDto {
  @ApiProperty({ example: 'synced' })
  status: string;
}
