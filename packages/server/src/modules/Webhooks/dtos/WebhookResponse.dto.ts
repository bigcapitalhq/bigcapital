import { ApiProperty } from '@nestjs/swagger';

export class WebhookResponseDto {
  @ApiProperty({ description: 'The unique identifier of the webhook', example: 1 })
  id: number;

  @ApiProperty({ description: 'Name of the webhook.', example: 'Invoice Webhook' })
  name: string;

  @ApiProperty({ description: 'Target URL for the webhook callback.', example: 'https://example.com/webhook' })
  url: string;

  @ApiProperty({ description: 'Entity type the webhook subscribes to.', example: 'sale_invoice' })
  entity: string;

  @ApiProperty({ description: 'List of events that trigger this webhook.', example: ['created', 'edited', 'deleted'] })
  events: string[];

  @ApiProperty({ description: 'HTTP method for the webhook.', example: 'POST' })
  method: string;

  @ApiProperty({ description: 'Custom headers to include in the webhook request.', type: 'array' })
  headers: Array<{ param_name: string; param_value: string }>;

  @ApiProperty({ description: 'Secret key for HMAC signature.', example: 'whsec_123456', nullable: true })
  secret: string | null;

  @ApiProperty({ description: 'Whether the webhook is active.', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp.', example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp.', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}
