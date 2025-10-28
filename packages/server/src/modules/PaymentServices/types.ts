import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class EditPaymentMethodOptionsDto {
  @IsOptional()
  @IsNumber()
  bankAccountId?: number;

  @IsOptional()
  @IsNumber()
  clearningAccountId?: number;

  @IsOptional()
  @IsBoolean()
  showVisa?: boolean;

  @IsOptional()
  @IsBoolean()
  showMasterCard?: boolean;

  @IsOptional()
  @IsBoolean()
  showDiscover?: boolean;

  @IsOptional()
  @IsBoolean()
  showAmer?: boolean;

  @IsOptional()
  @IsBoolean()
  showJcb?: boolean;

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
    type: String,
    description: 'Payment method name',
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
