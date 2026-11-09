import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class SubscriptionUsageResourceDto {
  @ApiProperty({ example: 2 })
  used: number;

  @ApiProperty({ example: 5, nullable: true })
  limit: number | null;
}

@ApiExtraModels(SubscriptionUsageResourceDto)
export class SubscriptionUsageResponseDto {
  @ApiProperty({ enum: ['free', 'paid'], example: 'free' })
  plan: 'free' | 'paid';

  @ApiProperty({ type: SubscriptionUsageResourceDto })
  invoices: SubscriptionUsageResourceDto;

  @ApiProperty({ type: SubscriptionUsageResourceDto })
  bills: SubscriptionUsageResourceDto;
}
