import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Single system subscription (no Lemon Squeezy data).
 * Mirrors the output of `GetSubscriptionsTransformer`.
 */
export class SubscriptionResponseDto {
  @ApiProperty({ example: 'main' })
  slug: string;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'inactive', 'on_trial', 'canceled'],
  })
  status: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: false })
  inactive: boolean;

  @ApiProperty({ example: false })
  onTrial: boolean;

  @ApiProperty({ example: false })
  canceled: boolean;

  @ApiProperty({ example: false })
  ended: boolean;

  @ApiProperty({ example: 'succeed', enum: ['succeed', 'failed'] })
  paymentStatus: string;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z', nullable: true })
  startsAt: Date | null;

  @ApiPropertyOptional({ example: '2024-02-01T00:00:00.000Z', nullable: true })
  endsAt: Date | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  canceledAt: Date | null;

  @ApiPropertyOptional({ example: '2024-01-07T00:00:00.000Z', nullable: true })
  trialEndsAt: Date | null;

  @ApiProperty({ example: 'Active' })
  statusFormatted: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  canceledAtFormatted: string | null;

  @ApiPropertyOptional({ example: 'Jan 1, 2024', nullable: true })
  endsAtFormatted: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  trialStartsAtFormatted: string | null;

  @ApiPropertyOptional({ example: 'Jan 7, 2024', nullable: true })
  trialEndsAtFormatted: string | null;

  @ApiProperty({ example: 'Standard' })
  planName: string;

  @ApiProperty({ example: 'standard' })
  planSlug: string;

  @ApiProperty({ example: 10 })
  planPrice: number;

  @ApiProperty({ example: 'USD' })
  planPriceCurrency: string;

  @ApiProperty({ example: '$10' })
  planPriceFormatted: string;

  @ApiProperty({ example: 'month' })
  planPeriod: string;
}
