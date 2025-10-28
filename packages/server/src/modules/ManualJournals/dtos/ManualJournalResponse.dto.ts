import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ManualJournalEntryResponseDto {
  @ApiProperty({ description: 'Entry index', example: 1 })
  index: number;

  @ApiPropertyOptional({ description: 'Credit amount', example: 1000.0 })
  credit?: number;

  @ApiPropertyOptional({ description: 'Debit amount', example: 0.0 })
  debit?: number;

  @ApiProperty({ description: 'Account ID', example: 1 })
  accountId: number;

  @ApiPropertyOptional({
    description: 'Entry note',
    example: 'Payment for services',
  })
  note?: string;

  @ApiPropertyOptional({ description: 'Contact ID', example: 1 })
  contactId?: number;

  @ApiPropertyOptional({ description: 'Branch ID', example: 1 })
  branchId?: number;

  @ApiPropertyOptional({ description: 'Project ID', example: 1 })
  projectId?: number;

  @ApiPropertyOptional({ description: 'Account details' })
  account?: any;

  @ApiPropertyOptional({ description: 'Contact details' })
  contact?: any;

  @ApiPropertyOptional({ description: 'Branch details' })
  branch?: any;
}

export class ManualJournalResponseDto {
  @ApiProperty({ description: 'Manual Journal ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Journal date', example: '2024-03-20' })
  date: Date;

  @ApiProperty({ description: 'Journal number', example: 'MJ-2024-001' })
  journalNumber: string;

  @ApiPropertyOptional({ description: 'Journal type', example: 'General' })
  journalType?: string;

  @ApiPropertyOptional({ description: 'Reference number', example: 'REF-001' })
  reference?: string;

  @ApiProperty({ description: 'Total amount', example: 1000.0 })
  amount: number;

  @ApiPropertyOptional({ description: 'Currency code', example: 'USD' })
  currencyCode?: string;

  @ApiPropertyOptional({ description: 'Exchange rate', example: 1.0 })
  exchangeRate?: number;

  @ApiPropertyOptional({
    description: 'Description',
    example: 'Monthly journal entry',
  })
  description?: string;

  @ApiProperty({ description: 'Published status', example: false })
  isPublished: boolean;

  @ApiPropertyOptional({
    description: 'Published date',
    example: '2024-03-20T10:00:00Z',
  })
  publishedAt?: Date;

  @ApiProperty({ description: 'Created date', example: '2024-03-20T09:00:00Z' })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Updated date',
    example: '2024-03-20T09:30:00Z',
  })
  updatedAt?: Date;

  @ApiPropertyOptional({ description: 'Branch ID', example: 1 })
  branchId?: number;

  @ApiProperty({ description: 'Formatted amount', example: '$1,000.00' })
  formattedAmount: string;

  @ApiProperty({ description: 'Formatted date', example: 'Mar 20, 2024' })
  formattedDate: string;

  @ApiPropertyOptional({
    description: 'Formatted published date',
    example: 'Mar 20, 2024',
  })
  formattedPublishedAt?: string;

  @ApiProperty({
    description: 'Formatted created date',
    example: 'Mar 20, 2024',
  })
  formattedCreatedAt: string;

  @ApiProperty({
    description: 'Journal entries',
    type: [ManualJournalEntryResponseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManualJournalEntryResponseDto)
  entries: ManualJournalEntryResponseDto[];

  @ApiPropertyOptional({ description: 'Attachments' })
  attachments?: any[];
}
