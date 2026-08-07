import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BranchResponseDto } from '@/modules/Branches/dtos/BranchResponse.dto';
import { AccountResponseDto } from '@/modules/Accounts/dtos/AccountResponse.dto';

export class ExpenseCategoryResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the expense category',
  })
  id: number;

  @ApiProperty({
    example: 100,
    description: 'The amount of the expense category',
  })
  amount: number;

  @ApiProperty({
    example: 50,
    description: 'The allocated cost amount of the expense category',
  })
  allocatedCostAmount: number;

  @ApiProperty({
    example: 1,
    description: 'The expense account ID associated with this category',
  })
  expenseAccountId: number;

  @ApiProperty({
    example: 1,
    description: 'The project ID associated with this category',
    required: false,
  })
  projectId?: number;

  @ApiProperty({
    example: 'Office supplies for Q1',
    description: 'The description of the expense category',
  })
  description: string;

  @ApiProperty({
    example: 50,
    description: 'The unallocated cost amount of the expense category',
  })
  unallocatedCostAmount: number;

  @ApiProperty({
    type: () => AccountResponseDto,
    description: 'The expense account associated with this category',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AccountResponseDto)
  expenseAccount?: AccountResponseDto;

  @ApiProperty({
    example: '$100.00',
    description: 'The formatted amount of the expense category',
    required: false,
  })
  @IsOptional()
  @IsString()
  amountFormatted?: string;
}

export class ExpenseResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the expense',
  })
  id: number;

  @ApiProperty({
    example: 1000,
    description: 'The total amount of the expense',
  })
  totalAmount: number;

  @ApiProperty({
    example: 'USD',
    description: 'The currency code of the expense',
  })
  currencyCode: string;

  @ApiProperty({
    example: 1.2,
    description: 'The exchange rate used for the expense',
  })
  exchangeRate: number;

  @ApiProperty({
    example: 'Office supplies and equipment',
    description: 'The description of the expense',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the payment account used for this expense',
  })
  paymentAccountId: number;

  @ApiProperty({
    example: 'EXP-2024-001',
    description: 'The reference number of the expense',
  })
  referenceNo: string;

  @ApiProperty({
    example: '2024-03-20T10:00:00Z',
    description: 'The date when the expense was published',
    required: false,
  })
  publishedAt?: Date;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who created the expense',
  })
  userId: number;

  @ApiProperty({
    example: '2024-03-20T10:00:00Z',
    description: 'The payment date of the expense',
  })
  paymentDate: Date;

  @ApiProperty({
    example: 1,
    description: 'The ID of the payee',
  })
  payeeId: number;

  @ApiProperty({
    example: 800,
    description: 'The landed cost amount of the expense',
  })
  landedCostAmount: number;

  @ApiProperty({
    example: 200,
    description: 'The allocated cost amount of the expense',
  })
  allocatedCostAmount: number;

  @ApiProperty({
    example: 0,
    description: 'The invoiced amount of the expense',
  })
  invoicedAmount: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the branch associated with the expense',
  })
  branchId: number;

  @ApiProperty({
    example: '2024-03-20T10:00:00Z',
    description: 'The creation date of the expense',
  })
  createdAt: Date;

  @ApiProperty({
    example: true,
    description: 'Whether the expense is published',
  })
  isPublished: boolean;

  @ApiProperty({
    example: 200,
    description: 'The unallocated cost amount of the expense',
  })
  unallocatedCostAmount: number;

  @ApiProperty({
    example: 1200,
    description:
      'The local amount of the expense (total amount * exchange rate)',
  })
  localAmount: number;

  @ApiProperty({
    example: 960,
    description: 'The local landed cost amount of the expense',
  })
  localLandedCostAmount: number;

  @ApiProperty({
    example: 240,
    description: 'The local allocated cost amount of the expense',
  })
  localAllocatedCostAmount: number;

  @ApiProperty({
    example: 240,
    description: 'The local unallocated cost amount of the expense',
  })
  localUnallocatedCostAmount: number;

  @ApiProperty({
    example: 1000,
    description: 'The billable amount of the expense',
  })
  billableAmount: number;

  @ApiProperty({
    example: '$1,000.00',
    description: 'The formatted total amount of the expense',
    required: false,
  })
  @IsOptional()
  @IsString()
  formattedAmount?: string;

  @ApiProperty({
    example: '$800.00',
    description: 'The formatted landed cost amount of the expense',
    required: false,
  })
  @IsOptional()
  @IsString()
  formattedLandedCostAmount?: string;

  @ApiProperty({
    example: '$200.00',
    description: 'The formatted allocated cost amount of the expense',
    required: false,
  })
  @IsOptional()
  @IsString()
  formattedAllocatedCostAmount?: string;

  @ApiProperty({
    example: '2024-03-20',
    description: 'The formatted payment date of the expense',
    required: false,
  })
  @IsOptional()
  @IsString()
  formattedDate?: string;

  @ApiProperty({
    example: '2024-03-20',
    description: 'The formatted creation date of the expense',
    required: false,
  })
  @IsOptional()
  @IsString()
  formattedCreatedAt?: string;

  @ApiProperty({
    example: '2024-03-20',
    description: 'The formatted publication date of the expense',
    required: false,
  })
  @IsOptional()
  @IsString()
  formattedPublishedAt?: string;

  @ApiProperty({
    type: () => BranchResponseDto,
    description: 'The branch associated with the expense',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BranchResponseDto)
  branch?: BranchResponseDto;

  @ApiProperty({
    type: [ExpenseCategoryResponseDto],
    description: 'The categories associated with this expense',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseCategoryResponseDto)
  categories: ExpenseCategoryResponseDto[];
}
