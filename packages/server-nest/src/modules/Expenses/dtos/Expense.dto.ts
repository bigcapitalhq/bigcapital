import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class AttachmentDto {
  @IsString()
  key: string;
}

export class ExpenseCategoryDto {
  @IsInt()
  @IsNotEmpty()
  index: number;

  @IsInt()
  @IsNotEmpty()
  expenseAccountId: number;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  landedCost?: boolean;

  @IsInt()
  @IsOptional()
  projectId?: number;
}

export class CommandExpenseDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  @ApiProperty({
    description: 'The reference number of the expense',
    example: 'INV-123456',
  })
  referenceNo?: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The payment date of the expense',
    example: '2021-01-01',
  })
  paymentDate: Date;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The payment account id of the expense',
    example: 1,
  })
  paymentAccountId: number;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  @ApiProperty({
    description: 'The description of the expense',
    example: 'This is a description',
  })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The exchange rate of the expense',
    example: 1,
  })
  exchangeRate?: number;

  @IsString()
  @MaxLength(3)
  @IsOptional()
  @ApiProperty({
    description: 'The currency code of the expense',
    example: 'USD',
  })
  currencyCode?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The exchange rate of the expense',
    example: 1,
  })
  exchange_rate?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'The publish status of the expense',
    example: true,
  })
  publish?: boolean;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'The payee id of the expense',
    example: 1,
  })
  payeeId?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'The branch id of the expense',
    example: 1,
  })
  branchId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseCategoryDto)
  @ApiProperty({
    description: 'The categories of the expense',
    example: [
      {
        index: 1,
        expenseAccountId: 1,
        amount: 100,
        description: 'This is a description',
        landedCost: true,
        projectId: 1,
      },
    ],
  })
  categories: ExpenseCategoryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @IsOptional()
  @ApiProperty({
    description: 'The attachments of the expense',
    example: [
      {
        key: '123456',
      },
    ],
  })
  attachments?: AttachmentDto[];
}

export class CreateExpenseDto extends CommandExpenseDto {}
export class EditExpenseDto extends CommandExpenseDto {}
