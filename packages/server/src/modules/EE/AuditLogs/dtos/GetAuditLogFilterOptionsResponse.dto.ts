import { ApiProperty } from '@nestjs/swagger';

class AuditLogFilterOptionDto {
  @ApiProperty({ example: 'SaleInvoice' })
  key: string;

  @ApiProperty({ example: 'Sale Invoice' })
  label: string;
}

export class GetAuditLogFilterOptionsResponseDto {
  @ApiProperty({ type: [AuditLogFilterOptionDto] })
  subjects: AuditLogFilterOptionDto[];

  @ApiProperty({ type: [AuditLogFilterOptionDto] })
  actions: AuditLogFilterOptionDto[];
}
