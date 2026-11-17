import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateStripeCheckoutSessionBodyDto {
  @ApiProperty({
    description: 'The plan slug to subscribe to',
    example: 'capital-basic-monthly',
  })
  @IsString()
  planSlug: string;
}

export class ChangeSubscriptionPlanBodyDto {
  @ApiProperty({
    description: 'The target plan slug',
    example: 'capital-plus-monthly',
  })
  @IsString()
  planSlug: string;
}

export class SyncStripeCheckoutSessionBodyDto {
  @ApiProperty({
    description: 'The Stripe Checkout Session id returned in the success URL',
    example: 'cs_test_xxx',
  })
  @IsString()
  sessionId: string;
}
