import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum SaleInvoiceSmsNotificationKey {
  Details = 'details',
  Reminder = 'reminder',
}

export class NotifySaleInvoiceBySmsDto {
  @IsOptional()
  @IsEnum(SaleInvoiceSmsNotificationKey)
  @ApiPropertyOptional({
    description:
      'The notification key to determine the SMS template. Defaults to `details`.',
    enum: SaleInvoiceSmsNotificationKey,
    default: SaleInvoiceSmsNotificationKey.Details,
  })
  notification_key?: SaleInvoiceSmsNotificationKey;
}
