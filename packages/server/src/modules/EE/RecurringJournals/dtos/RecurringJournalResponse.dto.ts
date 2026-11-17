import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { ManualJournalEntryResponseDto } from '@/modules/ManualJournals/dtos/ManualJournalResponse.dto';

export class RecurringJournalResponseDto {
  @ApiProperty({ description: 'Recurring journal ID', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Profile name',
    example: 'Monthly depreciation',
  })
  profileName: string;

  @ApiPropertyOptional({ description: 'Reference' })
  reference?: string;

  @ApiPropertyOptional({ description: 'Profile notes / journal description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Journal type', example: 'Journal' })
  journalType?: string;

  @ApiPropertyOptional({
    description: 'Accounting basis',
    enum: AccountingBasis,
    nullable: true,
  })
  basis?: AccountingBasis | null;

  @ApiPropertyOptional({ description: 'Currency code', example: 'USD' })
  currencyCode?: string;

  @ApiPropertyOptional({ description: 'Exchange rate', example: 1 })
  exchangeRate?: number;

  @ApiPropertyOptional({ description: 'Branch ID' })
  branchId?: number;

  @ApiProperty({
    description: 'Profile status',
    enum: ['active', 'paused', 'completed'],
  })
  status: string;

  @ApiProperty({
    description: 'Recurrence frequency',
    enum: ['day', 'week', 'month', 'year'],
  })
  frequency: string;

  @ApiProperty({ description: 'Repeat interval', example: 1 })
  repeatInterval: number;

  @ApiProperty({ description: 'Start date', example: '2026-11-06' })
  startDate: string;

  @ApiPropertyOptional({ description: 'End date', example: '2027-11-06' })
  endDate?: string;

  @ApiPropertyOptional({ description: 'Maximum occurrences', example: 12 })
  maxOccurrences?: number;

  @ApiProperty({ description: 'Generated occurrences count', example: 3 })
  occurrencesCount: number;

  @ApiPropertyOptional({
    description: 'Next journal date',
    example: '2026-12-06',
  })
  nextJournalDate?: string;

  @ApiPropertyOptional({
    description: 'Last generated journal date',
    example: '2026-11-06',
  })
  lastJournalDate?: string;

  @ApiProperty({
    description: 'Whether generated journals are published automatically',
    example: false,
  })
  autoPublish: boolean;

  @ApiPropertyOptional({ description: 'Last generation error' })
  lastError?: string;

  @ApiPropertyOptional({ description: 'Consecutive failure count' })
  failureCount?: number;

  @ApiProperty({ description: 'Total debit amount', example: 1000 })
  amount: number;

  @ApiPropertyOptional({
    description: 'Recurring journal entries',
    type: [ManualJournalEntryResponseDto],
  })
  entries?: ManualJournalEntryResponseDto[];

  @ApiPropertyOptional({ description: 'Formatted start date' })
  startDateFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted end date' })
  endDateFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted next journal date' })
  nextJournalDateFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted last journal date' })
  lastJournalDateFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted created date' })
  createdAtFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted amount' })
  amountFormatted?: string;
}
