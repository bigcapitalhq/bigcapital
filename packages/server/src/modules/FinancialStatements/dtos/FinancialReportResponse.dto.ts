import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ============== Common DTOs ==============

export class FinancialReportTotalDto {
  @ApiProperty({ description: 'Numeric amount', type: Number })
  amount: number;

  @ApiProperty({ description: 'Formatted amount string' })
  formattedAmount: string;

  @ApiProperty({ description: 'Currency code' })
  currencyCode: string;

  @ApiPropertyOptional({ description: 'Date associated with the total' })
  date?: string | Date;
}

export class FinancialReportPercentageDto {
  @ApiProperty({ description: 'Percentage amount', type: Number })
  amount: number;

  @ApiProperty({ description: 'Formatted percentage string' })
  formattedAmount: string;
}

export class FinancialReportMetaDto {
  @ApiProperty({ description: 'Organization name' })
  organizationName: string;

  @ApiProperty({ description: 'Base currency code' })
  baseCurrency: string;

  @ApiProperty({ description: 'Date format string' })
  dateFormat: string;

  @ApiProperty({ description: 'Whether cost computation is running' })
  isCostComputeRunning: boolean;

  @ApiProperty({ description: 'Sheet name' })
  sheetName: string;
}

// ============== Table DTOs ==============

export class FinancialTableCellDto {
  @ApiProperty({ description: 'Cell key' })
  key: string;

  @ApiProperty({ description: 'Cell value' })
  value: string;
}

export class FinancialTableRowDto {
  @ApiProperty({
    description: 'Cell data for this row',
    type: [FinancialTableCellDto],
  })
  cells: FinancialTableCellDto[];

  @ApiProperty({ description: 'Row type classifications', type: [String] })
  rowTypes: string[];

  @ApiProperty({ description: 'Row identifier' })
  id: string | number;

  @ApiPropertyOptional({
    description: 'Child rows',
    type: () => [FinancialTableRowDto],
  })
  children?: FinancialTableRowDto[];
}

export class FinancialTableColumnDto {
  @ApiProperty({ description: 'Column key' })
  key: string;

  @ApiProperty({ description: 'Column header label' })
  label: string;

  @ApiPropertyOptional({ description: 'Cell position index', type: Number })
  cellIndex?: number;

  @ApiPropertyOptional({
    description: 'Nested column definitions',
    type: () => [FinancialTableColumnDto],
  })
  children?: FinancialTableColumnDto[];
}

export class FinancialTableDataDto {
  @ApiProperty({
    description: 'Table column definitions',
    type: [FinancialTableColumnDto],
  })
  columns: FinancialTableColumnDto[];

  @ApiProperty({ description: 'Table row data', type: [FinancialTableRowDto] })
  rows: FinancialTableRowDto[];
}

// ============== Base Report Response DTOs ==============

export class BaseFinancialReportResponseDto {
  @ApiProperty({ description: 'Report metadata', type: FinancialReportMetaDto })
  meta: FinancialReportMetaDto;
}

export class BaseFinancialTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({ description: 'Report metadata', type: FinancialReportMetaDto })
  meta: FinancialReportMetaDto;
}
