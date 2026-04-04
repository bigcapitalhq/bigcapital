import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class TaxRateSummaryDto {
  @ApiProperty({ description: 'Tax rate ID', type: Number })
  id: number;

  @ApiProperty({ description: 'Tax rate name' })
  name: string;

  @ApiProperty({ description: 'Tax rate percentage', type: Number })
  rate: number;

  @ApiProperty({ description: 'Taxable amount', type: FinancialReportTotalDto })
  taxableAmount: FinancialReportTotalDto;

  @ApiProperty({
    description: 'Tax amount collected',
    type: FinancialReportTotalDto,
  })
  taxAmount: FinancialReportTotalDto;

  @ApiProperty({
    description: 'Total sales (including tax)',
    type: FinancialReportTotalDto,
  })
  totalSales: FinancialReportTotalDto;
}

export class SalesTaxLiabilitySummaryMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted from date' })
  formattedFromDate: string;

  @ApiProperty({ description: 'Formatted to date' })
  formattedToDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class SalesTaxLiabilitySummaryQueryResponseDto {
  @ApiProperty({ description: 'Start date' })
  fromDate: string;

  @ApiProperty({ description: 'End date' })
  toDate: string;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  numberFormat: NumberFormatQueryDto;
}

export class SalesTaxLiabilitySummaryResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: SalesTaxLiabilitySummaryQueryResponseDto,
  })
  query: SalesTaxLiabilitySummaryQueryResponseDto;

  @ApiProperty({ description: 'Tax rate summaries', type: [TaxRateSummaryDto] })
  data: TaxRateSummaryDto[];

  @ApiProperty({
    description: 'Report metadata',
    type: SalesTaxLiabilitySummaryMetaDto,
  })
  meta: SalesTaxLiabilitySummaryMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as SalesTaxLiabilitySummaryTableCellDto,
  FinancialTableRowDto as SalesTaxLiabilitySummaryTableRowDto,
  FinancialTableColumnDto as SalesTaxLiabilitySummaryTableColumnDto,
  FinancialTableDataDto as SalesTaxLiabilitySummaryTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class SalesTaxLiabilitySummaryTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: SalesTaxLiabilitySummaryQueryResponseDto,
  })
  query: SalesTaxLiabilitySummaryQueryResponseDto;

  @ApiProperty({
    description: 'Report metadata',
    type: SalesTaxLiabilitySummaryMetaDto,
  })
  meta: SalesTaxLiabilitySummaryMetaDto;
}
