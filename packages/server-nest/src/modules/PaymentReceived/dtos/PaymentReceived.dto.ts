import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { IsString } from 'class-validator';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { IsInt } from 'class-validator';

export class PaymentReceivedEntryDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsInt()
  index?: number;

  @IsOptional()
  @IsInt()
  paymentReceiveId?: number;

  @IsInt()
  invoiceId: number;

  @IsNumber()
  paymentAmount: number;
}

export class CommandPaymentReceivedDto {
  @IsInt()
  customerId: number;

  @IsDateString()
  paymentDate: Date | string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsNumber()
  exchangeRate?: number;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsInt()
  depositAccountId: number;

  @IsOptional()
  @IsString()
  paymentReceiveNo?: string;

  @IsOptional()
  @IsString()
  statement?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentReceivedEntryDto)
  entries: PaymentReceivedEntryDto[];

  @IsOptional()
  @IsInt()
  branchId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentLinkDto)
  attachments?: AttachmentLinkDto[];
}

export class CreatePaymentReceivedDto extends CommandPaymentReceivedDto {}
export class EditPaymentReceivedDto extends CommandPaymentReceivedDto {}
