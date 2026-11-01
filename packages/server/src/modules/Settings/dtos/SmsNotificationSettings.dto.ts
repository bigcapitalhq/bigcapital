import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SmsNotificationAllowedVariableDto {
  @ApiProperty({
    description: 'The template variable name without braces.',
    example: 'CustomerName',
  })
  variable: string;

  @ApiProperty({
    description: 'The template variable description.',
    example: 'Customer name',
  })
  description: string;
}

export class SmsNotificationSettingResponseDto {
  @ApiProperty({
    description: 'The SMS notification key.',
    example: 'sale-invoice-details',
  })
  key: string;

  @ApiProperty({
    description: 'The notification label.',
    example: 'Sale Invoice Details',
  })
  notificationLabel: string;

  @ApiProperty({
    description: 'The notification description.',
    example: 'Sent to the customer when a sale invoice is created.',
  })
  notificationDescription: string;

  @ApiProperty({
    description: 'The module the notification belongs to.',
    example: 'Sales Invoices',
  })
  module: string;

  @ApiProperty({
    description: 'The formatted module name.',
    example: 'Invoice',
  })
  moduleFormatted: string;

  @ApiProperty({
    description: 'The default SMS message template.',
    example:
      'Hi {CustomerName}, invoice {InvoiceNumber} is due on {DueDate}. Amount due: {DueAmount}. - {CompanyName}',
  })
  defaultSmsMessage: string;

  @ApiProperty({
    description: 'The variables allowed in the SMS message template.',
    type: [SmsNotificationAllowedVariableDto],
  })
  allowedVariables: SmsNotificationAllowedVariableDto[];

  @ApiProperty({
    description: 'The current SMS message template.',
    example:
      'Hi {CustomerName}, invoice {InvoiceNumber} is due on {DueDate}. Amount due: {DueAmount}. - {CompanyName}',
  })
  smsMessage: string;

  @ApiProperty({
    description: 'Whether the auto SMS notification is enabled.',
    example: false,
  })
  isNotificationEnabled: boolean;
}

/**
 * Editable SMS notification fields. Property names are camelCase so the
 * global SerializeInterceptor (snake_case wire -> camelCase DTOs) maps them
 * correctly. snake_case aliases are accepted for backwards compatibility.
 */
export class EditSmsNotificationDto {
  @ApiPropertyOptional({
    description: 'The SMS message template.',
    example:
      'Hi {CustomerName}, invoice {InvoiceNumber} is due. - {CompanyName}',
  })
  @IsOptional()
  @IsString()
  messageText?: string;

  @ApiPropertyOptional({
    description: 'Deprecated alias of `messageText`.',
    deprecated: true,
  })
  @IsOptional()
  @IsString()
  smsMessage?: string;

  @ApiPropertyOptional({
    description: 'Whether the auto SMS notification is enabled.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isNotificationEnabled?: boolean;

  @ApiPropertyOptional({ deprecated: true })
  @IsOptional()
  @IsString()
  message_text?: string;

  @ApiPropertyOptional({ deprecated: true })
  @IsOptional()
  @IsString()
  sms_message?: string;

  @ApiPropertyOptional({ deprecated: true })
  @IsOptional()
  @IsBoolean()
  is_notification_enabled?: boolean;
}

export class EditSmsNotificationBodyDto extends EditSmsNotificationDto {
  @ApiProperty({
    description: 'The SMS notification key.',
    example: 'sale-invoice-details',
  })
  @IsString()
  key: string;
}
