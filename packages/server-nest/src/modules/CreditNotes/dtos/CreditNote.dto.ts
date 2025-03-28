import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { ApiProperty } from '@nestjs/swagger';
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

export class CreditNoteEntryDto extends ItemEntryDto {}

class AttachmentDto {
  @IsString()
  key: string;
}

export class CommandCreditNoteDto {
  @IsInt()
  @ApiProperty({ example: 1, description: 'The customer ID' })
  customerId: number;

  @IsOptional()
  @IsPositive()
  @ApiProperty({ example: 3.43, description: 'The exchange rate' })
  exchangeRate?: number;

  @IsDate()
  @Type(() => Date)
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
  @ApiProperty({
    example: false,
    description: 'The credit note is open',
  })
  open: boolean = false;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The warehouse ID',
  })
  warehouseId?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The branch ID',
  })
  branchId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreditNoteEntryDto)
  @Min(1)
  @ApiProperty({
    example: [
      {
        itemId: 1,
        quantity: 1,
        rate: 10,
        taxRateId: 1,
      },
    ],
    description: 'The credit note entries',
  })
  entries: CreditNoteEntryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The pdf template ID',
  })
  pdfTemplateId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 10,
    description: 'The discount amount',
  })
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
  @IsNumber()
  adjustment?: number;
}

export class CreateCreditNoteDto extends CommandCreditNoteDto {}
export class EditCreditNoteDto extends CommandCreditNoteDto {}
