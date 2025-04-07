import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BillPaymentEntryDto {
  @IsNumber()
  billId: number;

  @IsNumber()
  paymentAmount: number;
}

export class CommandBillPaymentDTO {
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
    description: 'The amount of the bill payment',
    example: 100,
  })
  amount?: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the payment account',
    example: 1,
  })
  paymentAccountId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The payment number of the bill payment',
    example: '123456',
  })
  paymentNumber?: string;

  @IsDate()
  @Type(() => Date)
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

  @IsString()
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

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The id of the branch',
    example: 1,
  })
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
