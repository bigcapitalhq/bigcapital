import { ApiProperty } from '@nestjs/swagger';

class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  pageSize: number;
}

export class AuditLogListItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5, required: false, nullable: true })
  userId: number | null;

  @ApiProperty({ example: 'John Doe', required: false, nullable: true })
  userName: string | null;

  @ApiProperty({ example: 'john@example.com', required: false, nullable: true })
  userEmail: string | null;

  @ApiProperty({ example: 'created' })
  action: string;

  @ApiProperty({ example: 'sale_invoice' })
  subject: string;

  @ApiProperty({ example: 42, required: false, nullable: true })
  subjectId: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: { invoiceNumber: 'INV-001' },
  })
  metadata: Record<string, unknown> | null;

  @ApiProperty({ example: 'Invoice INV-001 was created for $500.00' })
  summary: string;

  @ApiProperty({ example: '192.168.1.1', required: false, nullable: true })
  ip: string | null;

  @ApiProperty({ example: '2025-04-12T18:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: 'Apr 12, 2025 at 06:30 PM' })
  createdAtFormatted: string;
}

export class GetAuditLogsResponseDto {
  @ApiProperty({ type: [AuditLogListItemDto] })
  data: AuditLogListItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;
}
