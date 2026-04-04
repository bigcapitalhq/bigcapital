import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import {
  FinancialReportTotalDto,
  FinancialReportMetaDto,
  FinancialTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class CustomerBalanceDto {
  @ApiProperty({ description: 'Customer ID', type: Number })
  customerId: number;

  @ApiProperty({ description: 'Customer name' })
  customerName: string;

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

export class CustomerBalanceSummaryMetaDto extends FinancialReportMetaDto {
  @ApiProperty({ description: 'Formatted as-of date' })
  formattedAsDate: string;

  @ApiProperty({ description: 'Formatted date range' })
  formattedDateRange: string;
}

export class CustomerBalanceSummaryQueryResponseDto {
  @ApiProperty({ description: 'As-of date' })
  asDate: string;

  @ApiProperty({
    description: 'Number format settings',
    type: NumberFormatQueryDto,
  })
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({ description: 'Customer IDs to include', type: [Number] })
  customersIds: number[];

  @ApiProperty({ description: 'Exclude zero balance customers' })
  noneZero: boolean;

  @ApiProperty({ description: 'Exclude inactive customers' })
  noneInactive: boolean;
}

export class CustomerBalanceSummaryResponseDto {
  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: CustomerBalanceSummaryQueryResponseDto,
  })
  query: CustomerBalanceSummaryQueryResponseDto;

  @ApiProperty({ description: 'Customer balances', type: [CustomerBalanceDto] })
  data: CustomerBalanceDto[];

  @ApiProperty({
    description: 'Report metadata',
    type: CustomerBalanceSummaryMetaDto,
  })
  meta: CustomerBalanceSummaryMetaDto;
}

// Re-export table DTOs for convenience
export {
  FinancialTableCellDto as CustomerBalanceSummaryTableCellDto,
  FinancialTableRowDto as CustomerBalanceSummaryTableRowDto,
  FinancialTableColumnDto as CustomerBalanceSummaryTableColumnDto,
  FinancialTableDataDto as CustomerBalanceSummaryTableDataDto,
} from '../../dtos/FinancialReportResponse.dto';

export class CustomerBalanceSummaryTableResponseDto {
  @ApiProperty({
    description: 'Table data structure',
    type: () => FinancialTableDataDto,
  })
  table: FinancialTableDataDto;

  @ApiProperty({
    description: 'Query parameters used to generate the report',
    type: CustomerBalanceSummaryQueryResponseDto,
  })
  query: CustomerBalanceSummaryQueryResponseDto;

  @ApiProperty({
    description: 'Report metadata',
    type: CustomerBalanceSummaryMetaDto,
  })
  meta: CustomerBalanceSummaryMetaDto;
}
