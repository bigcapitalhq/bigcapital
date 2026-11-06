import { ApiProperty } from '@nestjs/swagger';

export class BankReconciliationResponseDto {
  @ApiProperty({ description: 'Reconciliation id', example: 1 })
  id: number;

  @ApiProperty({ description: 'Bank account id', example: 1000 })
  accountId: number;

  @ApiProperty({ description: 'Period start date', example: '2026-11-01' })
  startDate: string;

  @ApiProperty({ description: 'Formatted period start date' })
  formattedStartDate: string;

  @ApiProperty({ description: 'Period end date', example: '2026-11-30' })
  endDate: string;

  @ApiProperty({ description: 'Formatted period end date' })
  formattedEndDate: string;

  @ApiProperty({ description: 'Beginning balance', example: 1000 })
  beginningBalance: number;

  @ApiProperty({ description: 'Formatted beginning balance' })
  formattedBeginningBalance: string;

  @ApiProperty({
    description: 'Statement ending balance',
    example: 12500.75,
    nullable: true,
  })
  endingBalance: number | null;

  @ApiProperty({ description: 'Formatted statement ending balance' })
  formattedEndingBalance: string;

  @ApiProperty({ description: 'Cleared balance', example: 12500.75 })
  clearedBalance: number;

  @ApiProperty({ description: 'Formatted cleared balance' })
  formattedClearedBalance: string;

  @ApiProperty({ description: 'Difference', example: 0 })
  difference: number;

  @ApiProperty({ description: 'Formatted difference' })
  formattedDifference: string;

  @ApiProperty({
    description: 'Reconciliation status',
    enum: ['in_progress', 'reconciled', 'voided'],
    example: 'reconciled',
  })
  status: string;

  @ApiProperty({ description: 'Status label', example: 'Reconciled' })
  statusLabel: string;

  @ApiProperty({
    description: 'Number of reconciliation transactions',
    example: 12,
  })
  transactionsCount: number;

  @ApiProperty({ description: 'Whether the reconciliation is in progress' })
  isInProgress: boolean;

  @ApiProperty({ description: 'Whether the reconciliation is completed' })
  isReconciled: boolean;

  @ApiProperty({ description: 'Whether the reconciliation is voided' })
  isVoided: boolean;

  @ApiProperty({ description: 'Optional notes', nullable: true })
  notes: string | null;

  @ApiProperty({ description: 'Completion date', nullable: true })
  reconciledAt: string | null;

  @ApiProperty({ description: 'Void date', nullable: true })
  voidedAt: string | null;

  @ApiProperty({ description: 'Creation date' })
  createdAt: string;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: string;
}
