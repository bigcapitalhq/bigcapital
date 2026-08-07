import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Lemon Squeezy subscription URLs for one system subscription.
 * `urls` mirrors the Lemon Squeezy subscription `urls` object.
 */
export class LemonSubscriptionUrlsDto {
  @ApiPropertyOptional({
    example: 'https://.../update-payment-method',
    nullable: true,
  })
  updatePaymentMethod: string;

  @ApiPropertyOptional({
    example: 'https://.../customer-portal',
    nullable: true,
  })
  customerPortal: string;

  [key: string]: unknown;
}

export class LemonSubscriptionResponseDto {
  @ApiProperty({ example: 'main' })
  slug: string;

  @ApiProperty({ type: LemonSubscriptionUrlsDto })
  urls: LemonSubscriptionUrlsDto;
}
