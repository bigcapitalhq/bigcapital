import { ToNumber } from '@/common/decorators/Validators';
import { parseBoolean } from '@/utils/parse-boolean';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
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

  @IsString()
  @IsIn(['fixed', 'percent'])
  @IsOptional()
  @ApiProperty({
    example: 'fixed',
    description:
      'How the amount on this category was authored. "percent" means the amount is derived from `percent` × total expense.',
  })
  amountType?: 'fixed' | 'percent';

  @ToNumber()
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 50,
    description:
      'Percent of the total expense allocated to this category. Only used when amountType is "percent".',
  })
  percent?: number;
}

export class ExpensePaymentSplitDto {
  @ToNumber()
  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 123,
    description:
      'The id of an existing split row. Preserve on edit so upsertGraph updates in place instead of deleting and reinserting (which would orphan bank-match rows referencing the split).',
    required: false,
  })
  id?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'The index of the payment split row.',
  })
  index?: number;

  @IsNotEmpty()
  @ToNumber()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The payment account id of the split.',
  })
  paymentAccountId: number;

  @IsNotEmpty()
  @ToNumber()
  @IsNumber()
  @ApiProperty({
    example: 100,
    description: 'The amount paid from this payment account.',
  })
  amount: number;
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

  @IsOptional()
  @ToNumber()
  @IsInt()
  @ApiProperty({
    description:
      'The primary payment account id of the expense (denormalized from the first payment split). Optional when `paymentSplits` is provided.',
    example: 1,
  })
  paymentAccountId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpensePaymentSplitDto)
  @IsOptional()
  @ApiProperty({
    description:
      'Split payment across multiple accounts. When provided, the sum of splits must equal the sum of categories.',
    example: [
      { index: 1, paymentAccountId: 1, amount: 60 },
      { index: 2, paymentAccountId: 2, amount: 40 },
    ],
  })
  paymentSplits?: ExpensePaymentSplitDto[];

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
