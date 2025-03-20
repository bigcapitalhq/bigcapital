import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
}

class CreditNoteEntryDto extends ItemEntryDto {}

class AttachmentDto {
  @IsString()
  key: string;
}

export class CommandCreditNoteDto {
  @IsInt()
  customerId: number;

  @IsOptional()
  @IsPositive()
  exchangeRate?: number;

  @IsDate()
  @Type(() => Date)
  creditNoteDate: Date;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsOptional()
  @IsString()
  creditNoteNumber?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  termsConditions?: string;

  @IsBoolean()
  open: boolean = false;

  @IsOptional()
  @IsInt()
  warehouseId?: number;

  @IsOptional()
  @IsInt()
  branchId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreditNoteEntryDto)
  @Min(1)
  entries: CreditNoteEntryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @IsOptional()
  @IsInt()
  pdfTemplateId?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @IsOptional()
  @IsNumber()
  adjustment?: number;
}

export class CreateCreditNoteDto extends CommandCreditNoteDto {}
export class EditCreditNoteDto extends CommandCreditNoteDto {}
