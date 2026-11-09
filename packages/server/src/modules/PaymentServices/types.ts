import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class EditPaymentMethodOptionsDto {
  @ApiPropertyOptional({
    description: 'Linked bank account id',
    example: 12,
  })
  @IsOptional()
  @IsNumber()
  bankAccountId?: number;

  // Typo retained to match the underlying column mapping.
  @ApiPropertyOptional({
    description: 'Linked clearing account id',
    example: 34,
  })
  @IsOptional()
  @IsNumber()
  clearningAccountId?: number;

  @ApiPropertyOptional({
    description: 'Whether Visa is displayed at checkout.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  showVisa?: boolean;

  @ApiPropertyOptional({
    description: 'Whether MasterCard is displayed at checkout.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  showMasterCard?: boolean;

  @ApiPropertyOptional({
    description: 'Whether Discover is displayed at checkout.',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  showDiscover?: boolean;

  @ApiPropertyOptional({
    description: 'Whether American Express is displayed at checkout.',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  showAmer?: boolean;

  @ApiPropertyOptional({
    description: 'Whether JCB is displayed at checkout.',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  showJcb?: boolean;

  @ApiPropertyOptional({
    description: 'Whether Diners is displayed at checkout.',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  showDiners?: boolean;
}

export class EditPaymentMethodDTO {
  @IsOptional()
  @ValidateNested()
  @Type(() => EditPaymentMethodOptionsDto)
  @ApiPropertyOptional({
    type: () => EditPaymentMethodOptionsDto,
    description: 'Edit payment method options',
  })
  options?: EditPaymentMethodOptionsDto;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Payment method name',
    example: 'Stripe',
  })
  name?: string;
}

export interface GetPaymentMethodsPOJO {
  stripe: {
    isStripeAccountCreated: boolean;
    isStripePaymentEnabled: boolean;
    isStripePayoutEnabled: boolean;
    isStripeEnabled: boolean;
    isStripeServerConfigured: boolean;
    stripeAccountId: string | null;
    stripePaymentMethodId: number | null;
    stripePublishableKey: string | null;
    stripeAuthLink: string;
    stripeCurrencies: Array<string>;
    stripeRedirectUrl: string | null;
  };
}

export class StripePaymentMethodsStateDto {
  @ApiProperty({
    description: 'Whether the Stripe account record exists.',
    example: true,
  })
  isStripeAccountCreated: boolean;

  @ApiProperty({
    description: 'Whether Stripe payments are enabled.',
    example: true,
  })
  isStripePaymentEnabled: boolean;

  @ApiProperty({
    description: 'Whether Stripe payouts are enabled.',
    example: false,
  })
  isStripePayoutEnabled: boolean;

  @ApiProperty({
    description: 'Whether Stripe is enabled overall.',
    example: true,
  })
  isStripeEnabled: boolean;

  @ApiProperty({
    description: 'Whether Stripe is configured on the server (keys present).',
    example: true,
  })
  isStripeServerConfigured: boolean;

  @ApiProperty({
    description: 'Stripe account id, if connected.',
    example: 'acct_1MwQ...',
    nullable: true,
  })
  stripeAccountId: string | null;

  @ApiProperty({
    description: 'Internal payment method id of the Stripe integration.',
    example: 5,
    nullable: true,
  })
  stripePaymentMethodId: number | null;

  @ApiProperty({
    description: 'Stripe publishable key, if configured.',
    example: 'pk_live_...',
    nullable: true,
  })
  stripePublishableKey: string | null;

  @ApiProperty({
    description: 'Stripe OAuth authorization link.',
    example: 'https://connect.stripe.com/...',
  })
  stripeAuthLink: string;

  @ApiProperty({
    type: [String],
    description: 'Currencies supported by the Stripe integration.',
    example: ['USD', 'EUR'],
  })
  stripeCurrencies: string[];

  @ApiProperty({
    description: 'Redirect URL after Stripe OAuth flow.',
    example: 'https://app.example.com/settings/payment',
    nullable: true,
  })
  stripeRedirectUrl: string | null;
}

export class GetPaymentMethodsStateDto {
  @ApiProperty({
    type: () => StripePaymentMethodsStateDto,
    description: 'Stripe payment integration state.',
  })
  stripe: StripePaymentMethodsStateDto;
}

export class PaymentIntegrationDto {
  @ApiProperty({ description: 'Payment integration id.', example: 5 })
  id: number;

  @ApiProperty({
    description: 'Display name of the payment integration.',
    example: 'Stripe',
  })
  name: string;

  @ApiProperty({
    description: 'Payment service key (e.g. "stripe").',
    example: 'stripe',
  })
  service: string;

  @ApiProperty({
    description: 'Whether payment processing is enabled.',
    example: true,
  })
  paymentEnabled: boolean;

  @ApiProperty({
    description: 'Whether payout is enabled.',
    example: false,
  })
  payoutEnabled: boolean;

  @ApiProperty({
    description: 'Connected account id at the provider.',
    example: 'acct_1MwQ...',
  })
  accountId: string;

  @ApiProperty({
    description:
      'Provider-specific options (bank account id, clearing account id, card brand flags, ...).',
    type: 'object',
    additionalProperties: true,
    example: { bankAccountId: 12, clearingAccountId: 34 },
  })
  options: Record<string, unknown>;

  @ApiProperty({
    description:
      'Virtual attribute — true when both payment and payout are enabled.',
    example: false,
  })
  fullEnabled: boolean;

  @ApiPropertyOptional({
    description:
      'Human-readable service label. Present on the list endpoint (added by the transformer).',
    example: 'Stripe',
  })
  serviceFormatted?: string;
}

export class PaymentMethodMutationResponseDto {
  @ApiProperty({
    description: 'Id of the affected payment method.',
    example: 7,
  })
  id: number;

  @ApiProperty({
    description: 'Human-readable confirmation message.',
    example: 'The given payment method has been updated.',
  })
  message: string;
}
