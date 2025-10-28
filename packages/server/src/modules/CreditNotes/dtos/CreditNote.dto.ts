import { ToNumber } from '@/common/decorators/Validators';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  Min,
  ValidateNested,
} from 'class-validator';

enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
}

export class CreditNoteEntryDto extends ItemEntryDto {}

class AttachmentDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}

export class CommandCreditNoteDto {
  @ToNumber()
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'The customer ID' })
  customerId: number;

  @IsOptional()
  @ToNumber()
  @IsPositive()
  @ApiProperty({ example: 3.43, description: 'The exchange rate' })
  exchangeRate?: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '2021-09-01', description: 'The credit note date' })
  creditNoteDate: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123', description: 'The reference number' })
  referenceNo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123', description: 'The credit note number' })
  creditNoteNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123', description: 'The note' })
  note?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123', description: 'The terms and conditions' })
  termsConditions?: string;

  @IsBoolean()
  @ApiProperty({ example: false, description: 'The credit note is open' })
  open: boolean = false;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @ApiProperty({ example: 1, description: 'The warehouse ID' })
  warehouseId?: number;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @ApiProperty({ example: 1, description: 'The branch ID' })
  branchId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreditNoteEntryDto)
  @ArrayMinSize(1)
  @ApiProperty({
    example: [{ itemId: 1, quantity: 1, rate: 10, taxRateId: 1 }],
    description: 'The credit note entries',
  })
  entries: CreditNoteEntryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @IsOptional()
  @ToNumber()
  @IsInt()
  @ApiProperty({ example: 1, description: 'The pdf template ID' })
  pdfTemplateId?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @ApiProperty({ example: 10, description: 'The discount amount' })
  discount?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  @ApiProperty({
    example: 'percentage',
    description: 'The discount type',
    enum: DiscountType,
  })
  discountType?: DiscountType;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  adjustment?: number;
}

export class CreateCreditNoteDto extends CommandCreditNoteDto {}
export class EditCreditNoteDto extends CommandCreditNoteDto {}
