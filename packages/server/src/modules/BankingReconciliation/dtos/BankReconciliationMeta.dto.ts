import { ApiProperty } from '@nestjs/swagger';
import { BankReconciliationResponseDto } from './BankReconciliationResponse.dto';
import { BankReconciliationTransactionResponseDto } from './BankReconciliationTransactionResponse.dto';

export class BankReconciliationChangedTransactionDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  referenceType: string;

  @ApiProperty()
  referenceId: number;

  @ApiProperty()
  index: number;

  @ApiProperty()
  snapshotCredit: number;

  @ApiProperty()
  snapshotDebit: number;

  @ApiProperty({ nullable: true })
  currentCredit: number | null;

  @ApiProperty({ nullable: true })
  currentDebit: number | null;

  @ApiProperty()
  difference: number;
}

export class BankReconciliationListMetaDto {
  @ApiProperty()
  accountId: number;

  @ApiProperty()
  accountName: string;

  @ApiProperty()
  currencyCode: string;

  @ApiProperty()
  accountAmount: number;

  @ApiProperty()
  formattedAccountAmount: string;

  @ApiProperty({ nullable: true })
  bankBalance: number | null;

  @ApiProperty()
  formattedBankBalance: string;

  @ApiProperty()
  isSupported: boolean;

  @ApiProperty({ nullable: true })
  unsupportedReason: string | null;

  @ApiProperty()
  hasInProgress: boolean;

  @ApiProperty({ nullable: true })
  inProgressId: number | null;

  @ApiProperty({ nullable: true })
  lastReconciledEndDate: string | null;

  @ApiProperty({ nullable: true })
  firstTransactionDate: string | null;

  @ApiProperty()
  suggestedStartDate: string;

  @ApiProperty()
  suggestedEndDate: string;

  @ApiProperty()
  uncategorizedTransactionsCount: number;
}

export class BankReconciliationDetailMetaDto {
  @ApiProperty()
  isLatest: boolean;

  @ApiProperty()
  canUndo: boolean;

  @ApiProperty()
  canDelete: boolean;

  @ApiProperty()
  uncategorizedTransactionsCount: number;

  @ApiProperty({ type: [BankReconciliationChangedTransactionDto] })
  changedTransactions: BankReconciliationChangedTransactionDto[];
}

export class BankReconciliationsListResponseDto {
  @ApiProperty({ type: [BankReconciliationResponseDto] })
  data: BankReconciliationResponseDto[];

  @ApiProperty({ type: BankReconciliationListMetaDto })
  meta: BankReconciliationListMetaDto;
}

export class BankReconciliationDetailResponseDto {
  @ApiProperty({ type: BankReconciliationResponseDto })
  reconciliation: BankReconciliationResponseDto;

  @ApiProperty({ type: [BankReconciliationTransactionResponseDto] })
  transactions: BankReconciliationTransactionResponseDto[];

  @ApiProperty({ type: BankReconciliationDetailMetaDto })
  meta: BankReconciliationDetailMetaDto;
}
