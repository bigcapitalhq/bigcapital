import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

export class AccountTypeResponseDto {
  @ApiProperty({
    description: 'The display label for the account type',
    example: 'Cash',
  })
  label: string;

  @ApiProperty({
    description: 'The unique key for the account type',
    example: 'cash',
  })
  key: string;

  @ApiProperty({
    description: 'The normal balance type for the account',
    example: 'debit',
  })
  normal: string;

  @ApiProperty({
    description: 'The parent type of the account',
    example: 'current-asset',
  })
  parentType: string;

  @ApiProperty({
    description: 'The root type of the account',
    example: 'asset',
  })
  rootType: string;

  @ApiProperty({
    description: 'Whether the account type supports multiple currencies',
    example: true,
  })
  multiCurrency: boolean;

  @ApiProperty({
    description: 'Whether the account type appears on the balance sheet',
    example: true,
  })
  balanceSheet: boolean;

  @ApiProperty({
    description: 'Whether the account type appears on the income sheet',
    example: false,
  })
  incomeSheet: boolean;
}
