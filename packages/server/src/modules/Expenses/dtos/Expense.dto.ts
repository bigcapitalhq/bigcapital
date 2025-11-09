import { ToNumber } from '@/common/decorators/Validators';
import { parseBoolean } from '@/utils/parse-boolean';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsISO4217CurrencyCode,
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
  @ApiProperty({ example: 1, description: 'The index of the expense category' })
  index: number;

  @IsNotEmpty()
  @ToNumber()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The expense account id of the expense category',
  })
  expenseAccountId: number;

  @ToNumber()
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 100,
    description: 'The amount of the expense category',
  })
  amount?: number;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @ApiProperty({
    example: 'This is a description',
    description: 'The description of the expense category',
  })
  description?: string;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  @ApiProperty({
    example: true,
    description: 'The landed cost of the expense category',
  })
  landedCost?: boolean;

  @ToNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'The project id of the expense category',
  })
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

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The payment date of the expense',
    example: '2021-01-01',
  })
  paymentDate: Date;

  @IsNotEmpty()
  @ToNumber()
  @IsInt()
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

  @ToNumber()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'The exchange rate of the expense', example: 1 })
  exchangeRate?: number;

  @IsString()
  @MaxLength(3)
  @IsOptional()
  @IsISO4217CurrencyCode()
  @ApiProperty({
    description: 'The currency code of the expense',
    example: 'USD',
  })
  currencyCode?: string;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  @ApiProperty({
    description: 'The publish status of the expense',
    example: true,
  })
  publish?: boolean;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @ApiProperty({
    description: 'The payee id of the expense',
    example: 1,
  })
  payeeId?: number;

  @ToNumber()
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

export class CreateExpenseDto extends CommandExpenseDto { }
export class EditExpenseDto extends CommandExpenseDto { }
