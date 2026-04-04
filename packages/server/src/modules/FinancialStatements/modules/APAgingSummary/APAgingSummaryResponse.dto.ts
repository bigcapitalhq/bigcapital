import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class APAgingPeriodDto {
  @ApiProperty({ description: 'From period date' })
  fromPeriod: string;

  @ApiPropertyOptional({ description: 'To period date' })
  toPeriod: string | null;

  @ApiProperty({ description: 'Before days', type: Number })
  beforeDays: number;

  @ApiPropertyOptional({ description: 'To days', type: Number })
  toDays: number | null;
}

export class APAgingPeriodTotalDto extends APAgingPeriodDto {
  @ApiProperty({ description: 'Period total', type: FinancialReportTotalDto })
  total: FinancialReportTotalDto;
}

export class APAgingVendorDto {
  @ApiProperty({ description: 'Vendor name' })
  vendorName: string;

  @ApiProperty({
    description: 'Current balance',
    type: FinancialReportTotalDto,
  })
  current: FinancialReportTotalDto;

  @ApiProperty({ description: 'Aging periods', type: [APAgingPeriodTotalDto] })
  aging: APAgingPeriodTotalDto[];

  @ApiProperty({ description: 'Vendor total', type: FinancialReportTotalDto })
  total: FinancialReportTotalDto;
}

export class APAgingSummaryDataDto {
  @ApiProperty({ description: 'Vendors aging data', type: [APAgingVendorDto] })
  vendors: APAgingVendorDto[];

  @ApiProperty({ description: 'Current total', type: FinancialReportTotalDto })
  current: FinancialReportTotalDto;

  @ApiProperty({ description: 'Aging totals', type: [APAgingPeriodTotalDto] })
  aging: APAgingPeriodTotalDto[];

  @ApiProperty({ description: 'Grand total', type: FinancialReportTotalDto })
  total: FinancialReportTotalDto;
}

export class APAgingSummaryMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted as-of date' })
  formattedAsDate: string;
}

export class APAgingSummaryQueryResponseDto {
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

  @ApiProperty({ description: 'Vendor IDs to include', type: [Number] })
  vendorsIds: number[];

  @ApiProperty({ description: 'Branch IDs to include', type: [Number] })
  branchesIds: number[];

  @ApiProperty({ description: 'Exclude zero balance accounts' })
  noneZero: boolean;
}

export class APAgingSummaryResponseDto {
  @ApiProperty({
    description: 'Aging summary data',
    type: APAgingSummaryDataDto,
  })
  data: APAgingSummaryDataDto;

  @ApiProperty({ description: 'Report metadata', type: APAgingSummaryMetaDto })
  meta: APAgingSummaryMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as APAgingSummaryTableCellDto,
  FinancialTableRowDto as APAgingSummaryTableRowDto,
  FinancialTableColumnDto as APAgingSummaryTableColumnDto,
  FinancialTableDataDto as APAgingSummaryTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class APAgingSummaryTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: APAgingSummaryQueryResponseDto,
  })
  query: APAgingSummaryQueryResponseDto;

  @ApiProperty({ description: 'Report metadata', type: APAgingSummaryMetaDto })
  meta: APAgingSummaryMetaDto;
}
