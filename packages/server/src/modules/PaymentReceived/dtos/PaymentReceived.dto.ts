import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { ToNumber } from '@/common/decorators/Validators';
import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';

export class PaymentReceivedEntryDto {
  @ToNumber()
  @IsOptional()
  @IsInt()
  id?: number;

  @ToNumber()
  @IsOptional()
  @IsInt()
  index?: number;

  @IsOptional()
  @IsInt()
  paymentReceiveId?: number;

  @IsInt()
  @IsNotEmpty()
  invoiceId: number;

  @IsNumber()
  @IsNotEmpty()
  paymentAmount: number;
}

export class CommandPaymentReceivedDto {
  @ToNumber()
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id of the customer', example: 1 })
  customerId: number;

  @IsDateString()
  @ApiProperty({
    description: 'The payment date of the payment received',
    example: '2021-01-01',
  })
  paymentDate: Date | string;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @ApiProperty({
    description: 'The amount of the payment received',
    example: 100,
  })
  amount?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @ApiProperty({
    description: 'The exchange rate of the payment received',
    example: 1,
  })
  exchangeRate?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The reference number of the payment received',
    example: '123456',
  })
  referenceNo?: string;

  @ToNumber()
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the deposit account',
    example: 1,
  })
  depositAccountId: number;

  @IsOptional()
  @ToNumber()
  @IsString()
  @ApiProperty({
    description: 'The payment receive number of the payment received',
    example: '123456',
  })
  paymentReceiveNo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The statement of the payment received',
    example: '123456',
  })
  statement?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentReceivedEntryDto)
  @ApiProperty({
    description: 'The entries of the payment received',
    example: [{ invoiceId: 1, paymentAmount: 100 }],
  })
  entries: PaymentReceivedEntryDto[];

  @IsOptional()
  @ToNumber()
  @IsInt()
  @ApiProperty({
    description: 'The id of the branch',
    example: 1,
  })
  branchId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentLinkDto)
  @ApiProperty({
    description: 'The attachments of the payment received',
    example: [
      {
        id: 1,
        type: 'bill',
      },
    ],
  })
  attachments?: AttachmentLinkDto[];
}

export class CreatePaymentReceivedDto extends CommandPaymentReceivedDto {}
export class EditPaymentReceivedDto extends CommandPaymentReceivedDto {}
