import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  FinancialTableDataDto,
  FinancialTableRowDto,
} from '../../dtos/FinancialReportResponse.dto';
import { ReconciliationReportStatus } from './ReconciliationStatusQuery.dto';

export class ReconciliationStatusTransactionDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: String, format: 'date', nullable: true })
  date: string | null;

  @ApiProperty({ type: String, nullable: true })
  reference: string | null;

  @ApiProperty({ type: String, nullable: true })
  type: string | null;

  @ApiProperty()
  deposit: number;

  @ApiProperty()
  withdrawal: number;

  @ApiProperty({ enum: ReconciliationReportStatus })
  status: ReconciliationReportStatus;
}

export class ReconciliationStatusBankAccountDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  currencyCode: string;
}

export class ReconciliationStatusAccountReportDto extends ReconciliationStatusBankAccountDto {
  @ApiProperty({ description: 'Ledger balance before the first report date' })
  openingBalance: number;

  @ApiProperty({ description: 'Ledger balance through the last report date' })
  closingBalance: number;

  @ApiProperty({ type: [ReconciliationStatusTransactionDto] })
  transactions: ReconciliationStatusTransactionDto[];
}

export class ReconciliationStatusResponseDto {
  @ApiProperty({
    description: 'Bank accounts available for filtering',
    type: [ReconciliationStatusBankAccountDto],
  })
  bankAccounts: ReconciliationStatusBankAccountDto[];

  @ApiProperty({ type: [ReconciliationStatusAccountReportDto] })
  accounts: ReconciliationStatusAccountReportDto[];
}

export class ReconciliationStatusTableRowDto extends OmitType(
  FinancialTableRowDto,
  ['id', 'meta', 'children'] as const,
) {
  @ApiProperty({ type: String })
  id: string;
}

export class ReconciliationStatusTableDataDto extends FinancialTableDataDto {
  @ApiProperty({ type: [ReconciliationStatusTableRowDto] })
  rows: ReconciliationStatusTableRowDto[];
}

export class ReconciliationStatusTableMetaDto {
  @ApiProperty()
  organizationName: string;

  @ApiProperty()
  sheetName: string;

  @ApiProperty()
  formattedDateRange: string;

  @ApiProperty({ enum: ReconciliationReportStatus })
  status: ReconciliationReportStatus;
}

export class ReconciliationStatusTableResponseDto {
  @ApiProperty({ type: ReconciliationStatusTableDataDto })
  table: ReconciliationStatusTableDataDto;

  @ApiProperty({ type: ReconciliationStatusTableMetaDto })
  meta: ReconciliationStatusTableMetaDto;

  @ApiProperty({ type: [ReconciliationStatusBankAccountDto] })
  bankAccounts: ReconciliationStatusBankAccountDto[];
}
