import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WebhookDeliveryResponseDto {
  @ApiProperty({ description: 'The unique identifier of the delivery log', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID of the associated webhook', example: 1 })
  webhookId: number;

  @ApiProperty({ description: 'The event type that was delivered.', example: 'sale_invoice.created' })
  eventType: string;

  @ApiProperty({ description: 'The payload that was sent.', type: 'object' })
  payload: Record<string, any>;

  @ApiPropertyOptional({ description: 'HTTP response status code.', example: 200, nullable: true })
  responseStatus?: number;

  @ApiPropertyOptional({ description: 'HTTP response body.', example: 'OK', nullable: true })
  responseBody?: string;

  @ApiProperty({ description: 'Number of delivery attempts.', example: 1 })
  attemptCount: number;

  @ApiPropertyOptional({ description: 'Error message if delivery failed.', example: 'Connection timeout', nullable: true })
  errorMessage?: string;

  @ApiPropertyOptional({ description: 'Timestamp when the delivery succeeded.', example: '2024-01-01T00:00:00.000Z', nullable: true })
  deliveredAt?: string;

  @ApiProperty({ description: 'Creation timestamp.', example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;
}
