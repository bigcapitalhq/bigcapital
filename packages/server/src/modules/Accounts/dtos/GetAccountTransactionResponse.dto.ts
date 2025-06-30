import { ApiProperty } from '@nestjs/swagger';

export class GetAccountTransactionResponseDto {
  /**
   * The transaction date (ISO string or Date).
   */
  @ApiProperty({
    description: 'The transaction date (ISO string or Date)',
    example: '2024-01-01',
  })
  date: string | Date;

  /**
   * The formatted transaction date (string).
   */
  @ApiProperty({
    description: 'The formatted transaction date',
    example: '01 Jan 2024',
  })
  formattedDate: string;

  /**
   * The transaction type (referenceType from model).
   */
  @ApiProperty({
    description: 'The transaction type (referenceType from model)',
    example: 'INVOICE',
  })
  transactionType: string;

  /**
   * The transaction id (referenceId from model).
   */
  @ApiProperty({
    description: 'The transaction id (referenceId from model)',
    example: 123,
  })
  transactionId: number;

  /**
   * The formatted transaction type (translated string).
   */
  @ApiProperty({
    description: 'The formatted transaction type (translated string)',
    example: 'Invoice',
  })
  transactionTypeFormatted: string;

  /**
   * The credit amount (number).
   */
  @ApiProperty({ description: 'The credit amount', example: 100 })
  credit: number;

  /**
   * The debit amount (number).
   */
  @ApiProperty({ description: 'The debit amount', example: 50 })
  debit: number;

  /**
   * The formatted credit amount (string, e.g. currency formatted).
   */
  @ApiProperty({
    description: 'The formatted credit amount (e.g. currency formatted)',
    example: '100.00 USD',
  })
  formattedCredit: string;

  /**
   * The formatted debit amount (string, e.g. currency formatted).
   */
  @ApiProperty({
    description: 'The formatted debit amount (e.g. currency formatted)',
    example: '50.00 USD',
  })
  formattedDebit: string;

  /**
   * The foreign currency credit (number, credit * exchangeRate).
   */
  @ApiProperty({
    description: 'The foreign currency credit (credit * exchangeRate)',
    example: 120,
  })
  fcCredit: number;

  /**
   * The foreign currency debit (number, debit * exchangeRate).
   */
  @ApiProperty({
    description: 'The foreign currency debit (debit * exchangeRate)',
    example: 60,
  })
  fcDebit: number;

  /**
   * The formatted foreign currency credit (string).
   */
  @ApiProperty({
    description: 'The formatted foreign currency credit',
    example: '120.00 EUR',
  })
  formattedFcCredit: string;

  /**
   * The formatted foreign currency debit (string).
   */
  @ApiProperty({
    description: 'The formatted foreign currency debit',
    example: '60.00 EUR',
  })
  formattedFcDebit: string;
}
