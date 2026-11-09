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
  notificationKey?: SaleInvoiceSmsNotificationKey;

  @IsOptional()
  @IsEnum(SaleInvoiceSmsNotificationKey)
  @ApiPropertyOptional({
    description: 'Deprecated alias of `notificationKey`.',
    enum: SaleInvoiceSmsNotificationKey,
    deprecated: true,
  })
  notification_key?: SaleInvoiceSmsNotificationKey;
}
