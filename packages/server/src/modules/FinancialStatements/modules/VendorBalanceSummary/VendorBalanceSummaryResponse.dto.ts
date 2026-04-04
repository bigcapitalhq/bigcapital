import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class VendorBalanceDto {
  @ApiProperty({ description: 'Vendor ID', type: Number })
  vendorId: number;

  @ApiProperty({ description: 'Vendor name' })
  vendorName: string;

  @ApiPropertyOptional({
    description: 'Opening balance',
    type: FinancialReportTotalDto,
  })
  openingBalance?: FinancialReportTotalDto;

  @ApiProperty({
    description: 'Closing balance',
    type: FinancialReportTotalDto,
  })
  closingBalance: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Total debit',
    type: FinancialReportTotalDto,
  })
  totalDebit?: FinancialReportTotalDto;

  @ApiPropertyOptional({
    description: 'Total credit',
    type: FinancialReportTotalDto,
  })
  totalCredit?: FinancialReportTotalDto;
}

export class VendorBalanceSummaryMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted as-of date' })
  formattedAsDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class VendorBalanceSummaryQueryResponseDto {
  @ApiProperty({ description: 'As-of date' })
  asDate: string;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({ description: 'Vendor IDs to include', type: [Number] })
  vendorsIds: number[];

  @ApiProperty({ description: 'Exclude zero balance vendors' })
  noneZero: boolean;

  @ApiProperty({ description: 'Exclude inactive vendors' })
  noneInactive: boolean;
}

export class VendorBalanceSummaryResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: VendorBalanceSummaryQueryResponseDto,
  })
  query: VendorBalanceSummaryQueryResponseDto;

  @ApiProperty({ description: 'Vendor balances', type: [VendorBalanceDto] })
  data: VendorBalanceDto[];

  @ApiProperty({
    description: 'Report metadata',
    type: VendorBalanceSummaryMetaDto,
  })
  meta: VendorBalanceSummaryMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as VendorBalanceSummaryTableCellDto,
  FinancialTableRowDto as VendorBalanceSummaryTableRowDto,
  FinancialTableColumnDto as VendorBalanceSummaryTableColumnDto,
  FinancialTableDataDto as VendorBalanceSummaryTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class VendorBalanceSummaryTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: VendorBalanceSummaryQueryResponseDto,
  })
  query: VendorBalanceSummaryQueryResponseDto;

  @ApiProperty({
    description: 'Report metadata',
    type: VendorBalanceSummaryMetaDto,
  })
  meta: VendorBalanceSummaryMetaDto;
}
