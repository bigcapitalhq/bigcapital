import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
}

class PaymentMethodDto {
  @IsInt()
  paymentIntegrationId: number;

  @IsBoolean()
  enable: boolean;
}

class CommandSaleInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  customerId: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  invoiceDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dueDate: Date;

  @IsOptional()
  @IsString()
  invoiceNo?: string;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsOptional()
  @IsBoolean()
  delivered: boolean = false;

  @IsOptional()
  @IsString()
  invoiceMessage?: string;

  @IsOptional()
  @IsString()
  termsConditions?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  exchangeRate?: number;

  @IsOptional()
  @IsInt()
  warehouseId?: number;

  @IsOptional()
  @IsInt()
  branchId?: number;

  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsBoolean()
  isInclusiveTax?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemEntryDto)
  @MinLength(1)
  entries: ItemEntryDto[];

  @IsOptional()
  @IsInt()
  pdfTemplateId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  paymentMethods?: PaymentMethodDto[];

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @IsOptional()
  @IsNumber()
  adjustment?: number;

  @IsOptional()
  @IsInt()
  fromEstimateId?: number;
}

export class CreateSaleInvoiceDto extends CommandSaleInvoiceDto {}
export class EditSaleInvoiceDto extends CommandSaleInvoiceDto {}
