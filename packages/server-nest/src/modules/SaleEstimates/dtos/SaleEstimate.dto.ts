import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
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

class SaleEstimateEntryDto extends ItemEntryDto {}

class AttachmentDto {
  @IsString()
  key: string;
}
export class CommandSaleEstimateDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the customer',
    example: 1,
  })
  customerId: number;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'The date of the estimate',
    example: '2021-01-01',
  })
  estimateDate: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'The expiration date of the estimate',
    example: '2021-01-01',
  })
  expirationDate: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The reference of the estimate',
    example: '123456',
  })
  reference?: string;

  @IsString()
  @IsOptional()
  estimateNumber?: string;

  @IsBoolean()
  delivered: boolean = false;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  @ApiProperty({
    description: 'The exchange rate of the estimate',
    example: 1,
  })
  exchangeRate?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The id of the warehouse',
    example: 1,
  })
  warehouseId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The id of the branch',
    example: 1,
  })
  branchId?: number;

  @IsArray()
  @MinLength(1)
  @ValidateNested({ each: true })
  @Type(() => SaleEstimateEntryDto)
  @ApiProperty({
    description: 'The entries of the estimate',
    example: [
      {
        index: 1,
        itemId: 1,
        description: 'This is a description',
        quantity: 100,
        cost: 100,
      },
    ],
  })
  entries: SaleEstimateEntryDto[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The note of the estimate',
    example: 'This is a note',
  })
  note?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The terms and conditions of the estimate',
    example: 'This is a terms and conditions',
  })
  termsConditions?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The email to send the estimate to',
    example: 'test@test.com',
  })
  sendToEmail?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @ApiProperty({
    description: 'The attachments of the estimate',
    example: [
      {
        key: '123456',
      },
    ],
  })
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The id of the pdf template',
    example: 1,
  })
  pdfTemplateId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The discount of the estimate',
    example: 1,
  })
  discount?: number;

  @IsEnum(DiscountType)
  @ApiProperty({
    description: 'The type of the discount',
    example: DiscountType.Amount,
  })
  discountType: DiscountType = DiscountType.Amount;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The adjustment of the estimate',
    example: 1,
  })
  adjustment?: number;
}

export class CreateSaleEstimateDto extends CommandSaleEstimateDto {}
export class EditSaleEstimateDto extends CommandSaleEstimateDto {}
