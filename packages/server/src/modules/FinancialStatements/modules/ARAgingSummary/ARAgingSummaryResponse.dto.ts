import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class ARAgingPeriodDto {
  @ApiProperty({ description: 'From period date' })
  fromPeriod: string;

  @ApiPropertyOptional({ description: 'To period date' })
  toPeriod: string | null;

  @ApiProperty({ description: 'Before days', type: Number })
  beforeDays: number;

  @ApiPropertyOptional({ description: 'To days', type: Number })
  toDays: number | null;
}

export class ARAgingPeriodTotalDto extends ARAgingPeriodDto {
  @ApiProperty({ description: 'Period total', type: FinancialReportTotalDto })
  total: FinancialReportTotalDto;
}

export class ARAgingCustomerDto {
  @ApiProperty({ description: 'Customer name' })
  customerName: string;

  @ApiProperty({
    description: 'Current balance',
    type: FinancialReportTotalDto,
  })
  current: FinancialReportTotalDto;

  @ApiProperty({ description: 'Aging periods', type: [ARAgingPeriodTotalDto] })
  aging: ARAgingPeriodTotalDto[];

  @ApiProperty({ description: 'Customer total', type: FinancialReportTotalDto })
  total: FinancialReportTotalDto;
}

export class ARAgingSummaryDataDto {
  @ApiProperty({
    description: 'Customers aging data',
    type: [ARAgingCustomerDto],
  })
  customers: ARAgingCustomerDto[];

  @ApiProperty({ description: 'Current total', type: FinancialReportTotalDto })
  current: FinancialReportTotalDto;

  @ApiProperty({ description: 'Aging totals', type: [ARAgingPeriodTotalDto] })
  aging: ARAgingPeriodTotalDto[];

  @ApiProperty({ description: 'Grand total', type: FinancialReportTotalDto })
  total: FinancialReportTotalDto;
}

export class ARAgingSummaryMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted as-of date' })
  formattedAsDate: string;
}

export class ARAgingSummaryQueryResponseDto {
  @ApiProperty({ description: 'As-of date' })
  asDate: string;

  @ApiProperty({ description: 'Aging days before', type: Number })
  agingDaysBefore: number;

  @ApiProperty({ description: 'Number of aging periods', type: Number })
  agingPeriods: number;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({ description: 'Customer IDs to include', type: [Number] })
  customersIds: number[];

  @ApiProperty({ description: 'Branch IDs to include', type: [Number] })
  branchesIds: number[];

  @ApiProperty({ description: 'Exclude zero balance accounts' })
  noneZero: boolean;
}

export class ARAgingSummaryResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: ARAgingSummaryQueryResponseDto,
  })
  query: ARAgingSummaryQueryResponseDto;

  @ApiProperty({
    description: 'Aging columns definitions',
    type: [ARAgingPeriodDto],
  })
  columns: ARAgingPeriodDto[];

  @ApiProperty({
    description: 'Aging summary data',
    type: ARAgingSummaryDataDto,
  })
  data: ARAgingSummaryDataDto;

  @ApiProperty({ description: 'Report metadata', type: ARAgingSummaryMetaDto })
  meta: ARAgingSummaryMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as ARAgingSummaryTableCellDto,
  FinancialTableRowDto as ARAgingSummaryTableRowDto,
  FinancialTableColumnDto as ARAgingSummaryTableColumnDto,
  FinancialTableDataDto as ARAgingSummaryTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class ARAgingSummaryTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: ARAgingSummaryQueryResponseDto,
  })
  query: ARAgingSummaryQueryResponseDto;

  @ApiProperty({ description: 'Report metadata', type: ARAgingSummaryMetaDto })
  meta: ARAgingSummaryMetaDto;
}
