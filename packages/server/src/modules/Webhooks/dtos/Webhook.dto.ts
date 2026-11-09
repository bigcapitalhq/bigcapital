import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class WebhookHeaderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the header parameter.' })
  param_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Value of the header parameter.' })
  param_value: string;
}

export class CreateWebhookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the webhook.', example: 'Invoice Webhook' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Target URL for the webhook callback.', example: 'https://example.com/webhook' })
  url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Entity type the webhook subscribes to.', example: 'sale_invoice' })
  entity: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'List of events that trigger this webhook.', example: ['created', 'edited', 'deleted'] })
  events: string[];

  @IsEnum(['POST', 'PUT', 'DELETE'] as const)
  @IsOptional()
  @ApiPropertyOptional({ description: 'HTTP method for the webhook.', example: 'POST', default: 'POST' })
  method?: 'POST' | 'PUT' | 'DELETE';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WebhookHeaderDto)
  @ApiPropertyOptional({ description: 'Custom headers to include in the webhook request.', type: [WebhookHeaderDto] })
  headers?: WebhookHeaderDto[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Secret key for HMAC signature.', example: 'whsec_123456' })
  secret?: string;
}

export class EditWebhookDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Name of the webhook.', example: 'Invoice Webhook' })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Target URL for the webhook callback.', example: 'https://example.com/webhook' })
  url?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Entity type the webhook subscribes to.', example: 'sale_invoice' })
  entity?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ description: 'List of events that trigger this webhook.', example: ['created', 'edited', 'deleted'] })
  events?: string[];

  @IsEnum(['POST', 'PUT', 'DELETE'] as const)
  @IsOptional()
  @ApiPropertyOptional({ description: 'HTTP method for the webhook.', example: 'POST' })
  method?: 'POST' | 'PUT' | 'DELETE';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WebhookHeaderDto)
  @ApiPropertyOptional({ description: 'Custom headers to include in the webhook request.', type: [WebhookHeaderDto] })
  headers?: WebhookHeaderDto[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Secret key for HMAC signature.', example: 'whsec_123456' })
  secret?: string;
}
