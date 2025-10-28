import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsOptional, ToNumber } from '@/common/decorators/Validators';

enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
}

class SaleEstimateEntryDto extends ItemEntryDto { }

class AttachmentDto {
  @IsString()
  key: string;
}
export class CommandSaleEstimateDto {
  @IsNotEmpty()
  @ToNumber()
  @IsNumber()
  @ApiProperty({ description: 'The id of the customer', example: 1 })
  customerId: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'The date of the estimate',
    example: '2021-01-01',
  })
  estimateDate: Date;

  @IsNotEmpty()
  @IsDateString()
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
  @IsOptional()
  delivered?: boolean = false;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @Min(0.01)
  @ApiProperty({ description: 'The exchange rate of the estimate', example: 1 })
  exchangeRate?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @ApiProperty({ description: 'The id of the warehouse', example: 1 })
  warehouseId?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @ApiProperty({ description: 'The id of the branch', example: 1 })
  branchId?: number;

  @IsArray()
  @ArrayMinSize(1)
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

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The note of the estimate',
    example: 'This is a note',
  })
  note?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The terms and conditions of the estimate',
    example: 'This is a terms and conditions',
  })
  termsConditions?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'The email to send the estimate to',
    example: 'test@test.com',
  })
  sendToEmail?: string;

  @IsOptional()
  @IsArray()
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
  attachments?: AttachmentDto[];

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @ApiProperty({
    description: 'The id of the pdf template',
    example: 1,
  })
  pdfTemplateId?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @ApiProperty({
    description: 'The discount of the estimate',
    example: 1,
  })
  discount?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  @ApiProperty({
    description: 'The type of the discount',
    example: DiscountType.Amount,
  })
  discountType: DiscountType = DiscountType.Amount;

  @ToNumber()
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The adjustment of the estimate',
    example: 1,
  })
  adjustment?: number;
}

export class CreateSaleEstimateDto extends CommandSaleEstimateDto { }
export class EditSaleEstimateDto extends CommandSaleEstimateDto { }
