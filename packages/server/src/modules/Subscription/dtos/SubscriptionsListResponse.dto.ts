import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionResponseDto } from './SubscriptionResponse.dto';

export class SubscriptionsListResponseDto {
  @ApiProperty({ type: [SubscriptionResponseDto] })
  subscriptions: SubscriptionResponseDto[];
}
