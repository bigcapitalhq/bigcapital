import { ToNumber } from '@/common/decorators/Validators';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { Type, Transform } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
}

export class BillEntryDto extends ItemEntryDto {
  @ApiProperty({
    description: 'Flag indicating whether the entry contributes to landed cost',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  landedCost?: boolean;
}

class AttachmentDto {
  @ApiProperty({
    description: 'Storage key of the attachment file',
    example: 'attachments/bills/receipt.pdf',
  })
  @IsString()
  @IsNotEmpty()
  key: string;
}

export class CommandBillDto {
  @ApiProperty({
    description: 'Unique bill number',
    example: 'BILL-2024-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  billNumber: string;

  @ApiProperty({
    description: 'Reference number',
    example: 'PO-2024-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  referenceNo?: string;

  @ApiProperty({
    description: 'Date the bill was issued',
    example: '2024-03-15',
  })
  @IsNotEmpty()
  @IsDateString()
  billDate: Date;

  @ApiProperty({
    description: 'Date the bill is due',
    example: '2024-04-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({
    description: 'Vendor identifier',
    example: 1001,
  })
  @IsInt()
  @IsNotEmpty()
  vendorId: number;

  @ApiProperty({
    description: 'Exchange rate applied to bill amounts',
    example: 1.25,
    required: false,
  })
  @IsOptional()
  @ToNumber()
  @IsNumber()
  @IsPositive()
  exchangeRate?: number;

  @ApiProperty({
    description: 'Warehouse identifier',
    example: 101,
    required: false,
  })
  @IsOptional()
  @ToNumber()
  @IsInt()
  warehouseId?: number;

  @ApiProperty({
    description: 'Branch identifier',
    example: 201,
    required: false,
  })
  @IsOptional()
  @ToNumber()
  @IsInt()
  branchId?: number;

  @ApiProperty({
    description: 'Project identifier',
    example: 301,
    required: false,
  })
  @IsOptional()
  @ToNumber()
  @IsInt()
  projectId?: number;

  @ApiProperty({
    description: 'Additional notes about the bill',
    example: 'Office supplies and equipment for Q2 2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Indicates if the bill is open',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  open: boolean = false;

  @ApiProperty({
    description: 'Indicates if tax is inclusive in prices',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isInclusiveTax: boolean = false;

  @ApiProperty({
    description: 'Bill line items',
    type: () => BillEntryDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillEntryDto)
  @ArrayMinSize(1)
  entries: BillEntryDto[];

  @ApiProperty({
    description: 'File attachments associated with the bill',
    type: () => AttachmentDto,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @ApiProperty({
    description: 'Type of discount applied',
    example: DiscountType.Amount,
    enum: DiscountType,
    required: false,
  })
  @IsEnum(DiscountType)
  @IsOptional()
  discountType: DiscountType = DiscountType.Amount;

  @ApiProperty({
    description: 'Discount value',
    example: 100,
    required: false,
  })
  @IsOptional()
  @ToNumber()
  @IsNumber()
  @IsPositive()
  discount?: number;

  @ApiProperty({
    description: 'Adjustment value',
    example: 50,
    required: false,
  })
  @IsOptional()
  @ToNumber()
  @IsNumber()
  adjustment?: number;
}

export class CreateBillDto extends CommandBillDto { }
export class EditBillDto extends CommandBillDto { }
