import { ApiProperty } from '@nestjs/swagger';

/**
 * Bank Account Response DTO
 * Based on AccountResponseDto but excludes fields that are filtered out by CashflowAccountTransformer:
 * - predefined
 * - index
 * - accountTypeLabel
 */
export class BankAccountResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the account',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the account',
    example: 'Cash Account',
  })
  name: string;

  @ApiProperty({
    description: 'The slug of the account',
    example: 'cash-account',
  })
  slug: string;

  @ApiProperty({
    description: 'The code of the account',
    example: '1001',
  })
  code: string;

  @ApiProperty({
    description: 'The type of the account',
    example: 'bank',
  })
  accountType: string;

  @ApiProperty({
    description: 'The parent account ID',
    example: null,
  })
  parentAccountId: number | null;

  @ApiProperty({
    description: 'The currency code of the account',
    example: 'USD',
  })
  currencyCode: string;

  @ApiProperty({
    description: 'Whether the account is active',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'The bank balance of the account',
    example: 5000.0,
  })
  bankBalance: number;

  @ApiProperty({
    description: 'The formatted bank balance',
    example: '$5,000.00',
  })
  bankBalanceFormatted: string;

  @ApiProperty({
    description: 'The last feeds update timestamp',
    example: '2024-03-20T10:30:00Z',
  })
  lastFeedsUpdatedAt: string | Date | null;

  @ApiProperty({
    description: 'The formatted last feeds update timestamp',
    example: 'Mar 20, 2024 10:30 AM',
  })
  lastFeedsUpdatedAtFormatted: string;

  @ApiProperty({
    description: 'The last feeds updated from now (relative time)',
    example: '2 hours ago',
  })
  lastFeedsUpdatedFromNow: string;

  @ApiProperty({
    description: 'The amount of the account',
    example: 5000.0,
  })
  amount: number;

  @ApiProperty({
    description: 'The formatted amount',
    example: '$5,000.00',
  })
  formattedAmount: string;

  @ApiProperty({
    description: 'The Plaid item ID',
    example: 'plaid-item-123',
  })
  plaidItemId: string;

  @ApiProperty({
    description: 'The Plaid account ID',
    example: 'plaid-account-456',
  })
  plaidAccountId: string | null;

  @ApiProperty({
    description: 'Whether the feeds are active',
    example: true,
  })
  isFeedsActive: boolean;

  @ApiProperty({
    description: 'Whether the account is syncing owner',
    example: true,
  })
  isSyncingOwner: boolean;

  @ApiProperty({
    description: 'Whether the feeds are paused',
    example: false,
  })
  isFeedsPaused: boolean;

  @ApiProperty({
    description: 'The account normal',
    example: 'debit',
  })
  accountNormal: string;

  @ApiProperty({
    description: 'The formatted account normal',
    example: 'Debit',
  })
  accountNormalFormatted: string;

  @ApiProperty({
    description: 'The flatten name with all dependant accounts names',
    example: 'Assets: Cash Account',
  })
  flattenName: string;

  @ApiProperty({
    description: 'The account level in the hierarchy',
    example: 2,
  })
  accountLevel?: number;

  @ApiProperty({
    description: 'The creation timestamp',
    example: '2024-03-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The update timestamp',
    example: '2024-03-20T10:30:00Z',
  })
  updatedAt: Date;
}
