import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';

export class BillPaymentEntryDto {
  @IsNumber()
  billId: number;

  @IsNumber()
  paymentAmount: number;
}

export class CommandBillPaymentDTO {
  @IsNumber()
  vendorId: number;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsNumber()
  paymentAccountId: number;

  @IsString()
  @IsOptional()
  paymentNumber?: string;

  @IsDate()
  @Type(() => Date)
  paymentDate: Date | string;

  @IsNumber()
  @IsOptional()
  exchangeRate?: number;

  @IsString()
  @IsOptional()
  statement?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillPaymentEntryDto)
  entries: BillPaymentEntryDto[];

  @IsNumber()
  @IsOptional()
  branchId?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttachmentLinkDto)
  attachments?: AttachmentLinkDto[];
}

export class CreateBillPaymentDto extends CommandBillPaymentDTO {}
export class EditBillPaymentDto extends CommandBillPaymentDTO {}
