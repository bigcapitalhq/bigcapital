import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class SubscriptionPlanPriceResponseDto {
  @ApiProperty({ example: 'capital-basic-monthly' })
  slug: string;

  @ApiProperty({ example: 'month' })
  interval: string;

  @ApiProperty({ example: 1 })
  intervalCount: number;

  @ApiProperty({ example: 10 })
  amount: number;

  @ApiProperty({ example: '$10' })
  amountFormatted: string;

  @ApiProperty({ example: 'Per month' })
  priceLabel: string;
}

export class SubscriptionPlanFeatureResponseDto {
  @ApiProperty({ example: 'Unlimited Sale Invoices' })
  text: string;

  @ApiProperty({ required: false, example: 'Feature description' })
  hint?: string;

  @ApiProperty({ required: false, example: 'Feature label' })
  hintLabel?: string;
}

export class SubscriptionPlanGroupResponseDto {
  @ApiProperty({ example: 'capital-basic' })
  slug: string;

  @ApiProperty({ example: 'Capital Basic' })
  name: string;

  @ApiProperty({
    example: 'Good for service businesses that just started.',
  })
  description: string;

  @ApiProperty({ type: [SubscriptionPlanFeatureResponseDto] })
  features: SubscriptionPlanFeatureResponseDto[];

  @ApiProperty({ example: false })
  featured: boolean;

  @ApiProperty({ type: [SubscriptionPlanPriceResponseDto] })
  prices: SubscriptionPlanPriceResponseDto[];
}

@ApiExtraModels(
  SubscriptionPlanFeatureResponseDto,
  SubscriptionPlanPriceResponseDto,
)
export class GetSubscriptionPlansResponseDto {
  @ApiProperty({ type: [SubscriptionPlanGroupResponseDto] })
  plans: SubscriptionPlanGroupResponseDto[];
}
