import { ApiProperty } from '@nestjs/swagger';
import { LemonSubscriptionResponseDto } from './LemonSubscriptionResponse.dto';

export class LemonSubscriptionsListResponseDto {
  @ApiProperty({ type: [LemonSubscriptionResponseDto] })
  lemonSubscriptions: LemonSubscriptionResponseDto[];
}
