import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1, required: false, nullable: true })
  userId: number | null;

  @ApiProperty({ example: 'Inventory cost calculation completed' })
  title: string;

  @ApiProperty({
    example: 'The inventory cost for 12 items has been calculated.',
  })
  message: string;

  @ApiProperty({
    enum: ['success', 'info', 'warning', 'error'],
    example: 'info',
  })
  type: 'success' | 'info' | 'warning' | 'error';

  @ApiProperty({
    enum: ['inventory', 'billing', 'system', 'export', 'report'],
    example: 'inventory',
  })
  category: 'inventory' | 'billing' | 'system' | 'export' | 'report';

  @ApiProperty({
    description: 'Additional notification metadata',
    type: 'object',
    additionalProperties: true,
    example: { itemId: 1 },
    required: false,
    nullable: true,
  })
  metadata: Record<string, unknown> | null;

  @ApiPropertyOptional({
    description: 'Date the notification was read',
    example: '2024-03-20T10:00:00Z',
    nullable: true,
  })
  readAt: Date | null;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ example: false })
  isRead: boolean;
}

export class NotificationsListResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  notifications: NotificationResponseDto[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 3 })
  unreadCount: number;
}

export class UnreadNotificationsCountResponseDto {
  @ApiProperty({ example: 3 })
  count: number;
}

export class MarkNotificationAsReadResponseDto {
  @ApiProperty({
    type: NotificationResponseDto,
    required: false,
    nullable: true,
  })
  notification: NotificationResponseDto | null;
}

export class MarkAllNotificationsAsReadResponseDto {
  @ApiProperty({ example: 3 })
  markedAsRead: number;
}

export class DeleteNotificationResponseDto {
  @ApiProperty({ example: true })
  deleted: boolean;
}
