import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToNumber } from '@/common/decorators/Validators';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { ManualJournalEntryDto } from '@/modules/ManualJournals/dtos/ManualJournal.dto';
import { RecurringJournalFrequency } from '../RecurringJournal.types';

export class CommandRecurringJournalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Recurring journal profile name',
    example: 'Monthly depreciation',
  })
  profileName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ description: 'Reference' })
  reference?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Profile notes / journal description' })
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({
    description: 'Journal type copied to generated journals',
    default: 'Journal',
  })
  journalType?: string = 'Journal';

  @IsOptional()
  @IsEnum(AccountingBasis)
  @ApiPropertyOptional({
    description: 'Accounting basis copied to generated journals',
    enum: AccountingBasis,
    nullable: true,
  })
  basis?: AccountingBasis | null;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  @ApiPropertyOptional({ description: 'Currency code', example: 'USD' })
  currencyCode?: string;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @IsPositive()
  @ApiPropertyOptional({ description: 'Exchange rate', example: 1 })
  exchangeRate?: number;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @ApiPropertyOptional({ description: 'Branch ID' })
  branchId?: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'First journal date',
    example: '2026-11-06',
  })
  startDate: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Optional end date',
    example: '2027-11-06',
  })
  endDate?: string;

  @IsEnum(RecurringJournalFrequency)
  @ApiProperty({
    description: 'Recurrence frequency',
    enum: RecurringJournalFrequency,
    example: RecurringJournalFrequency.Month,
  })
  frequency: RecurringJournalFrequency;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Repeat every N periods',
    example: 1,
    default: 1,
  })
  repeatInterval?: number = 1;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Optional maximum number of generated journals',
    example: 12,
  })
  maxOccurrences?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description:
      'Whether generated journals are published automatically; otherwise they are saved as drafts',
    default: false,
  })
  autoPublish?: boolean = false;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManualJournalEntryDto)
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Recurring journal entries',
    type: ManualJournalEntryDto,
    isArray: true,
  })
  entries: ManualJournalEntryDto[];
}

export class CreateRecurringJournalDto extends CommandRecurringJournalDto {}

export class EditRecurringJournalDto extends CommandRecurringJournalDto {}
