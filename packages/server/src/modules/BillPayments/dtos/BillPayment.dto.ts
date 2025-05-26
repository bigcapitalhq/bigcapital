import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';
import { ToNumber } from '@/common/decorators/Validators';

export class BillPaymentEntryDto {
  @ToNumber()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id of the bill', example: 1 })
  billId: number;

  @ToNumber()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The payment amount of the bill payment',
    example: 100,
  })
  paymentAmount: number;
}

export class CommandBillPaymentDTO {
  @ToNumber()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id of the vendor', example: 1 })
  vendorId: number;

  @ToNumber()
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The amount of the bill payment',
    example: 100,
  })
  amount?: number;

  @ToNumber()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id of the payment account', example: 1 })
  paymentAccountId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The payment number of the bill payment',
    example: '123456',
  })
  paymentNumber?: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The payment date of the bill payment',
    example: '2021-01-01',
  })
  paymentDate: Date | string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The exchange rate of the bill payment',
    example: 1,
  })
  exchangeRate?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The statement of the bill payment',
    example: '123456',
  })
  statement?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillPaymentEntryDto)
  @ApiProperty({
    description: 'The entries of the bill payment',
    example: [
      {
        billId: 1,
        paymentAmount: 100,
      },
    ],
  })
  entries: BillPaymentEntryDto[];

  @ToNumber()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'The id of the branch', example: 1 })
  branchId?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttachmentLinkDto)
  @ApiProperty({
    description: 'The attachments of the bill payment',
    example: [
      {
        id: 1,
        type: 'bill',
      },
    ],
  })
  attachments?: AttachmentLinkDto[];
}

export class CreateBillPaymentDto extends CommandBillPaymentDTO {}
export class EditBillPaymentDto extends CommandBillPaymentDTO {}
