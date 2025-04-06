import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
}

export class VendorCreditEntryDto extends ItemEntryDto {}

class AttachmentDto {
  @IsString()
  key: string;
}

export class CommandVendorCreditDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the vendor',
    example: 1,
  })
  vendorId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The exchange rate of the vendor credit',
    example: 1,
  })
  exchangeRate?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The vendor credit number',
    example: '123456',
  })
  vendorCreditNumber?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The reference number of the vendor credit',
    example: '123456',
  })
  referenceNo?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date of the vendor credit',
    example: '2021-01-01',
  })
  vendorCreditDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The note of the vendor credit',
    example: '123456',
  })
  note?: string;

  @IsOptional()
  @ApiProperty({
    description: 'The open status of the vendor credit',
    example: true,
  })
  open: boolean = false;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The warehouse id of the vendor credit',
    example: 1,
  })
  warehouseId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The branch id of the vendor credit',
    example: 1,
  })
  branchId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VendorCreditEntryDto)
  @ApiProperty({
    description: 'The entries of the vendor credit',
    example: [
      {
        itemId: 1,
        quantity: 1,
        unitPrice: 1,
        discount: 1,
        discountType: DiscountType.Percentage,
        accountId: 1,
        amount: 1,
      },
    ],
  })
  entries: VendorCreditEntryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @IsOptional()
  @ApiProperty({
    description: 'The attachments of the vendor credit',
    example: [
      {
        key: '123456',
      },
    ],
  })
  attachments?: AttachmentDto[];

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The discount of the vendor credit',
    example: 1,
  })
  discount?: number;

  @IsEnum(DiscountType)
  @IsOptional()
  @ApiProperty({
    description: 'The discount type of the vendor credit',
    example: DiscountType.Percentage,
  })
  discountType?: DiscountType;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The adjustment of the vendor credit',
    example: 1,
  })
  adjustment?: number;
}

export class CreateVendorCreditDto extends CommandVendorCreditDto {}
export class EditVendorCreditDto extends CommandVendorCreditDto {}
