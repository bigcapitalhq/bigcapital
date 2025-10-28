import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BankRuleAssignCategory, BankRuleConditionType } from '../types';

class BankRuleConditionResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the bank rule condition',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The field to check in the condition',
    example: 'description',
    enum: ['description', 'amount'],
  })
  field: string;

  @ApiProperty({
    description: 'The comparison operator to use',
    example: 'contains',
    enum: [
      'equals',
      'equal',
      'contains',
      'not_contain',
      'bigger',
      'bigger_or_equal',
      'smaller',
      'smaller_or_equal',
    ],
  })
  comparator: string;

  @ApiProperty({
    description: 'The value to compare against',
    example: 'Salary',
  })
  value: string;
}

export class BankRuleResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the bank rule',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the bank rule',
    example: 'Monthly Salary',
  })
  name: string;

  @ApiProperty({
    description: 'The order in which the rule should be applied',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'The account ID to apply the rule if',
    example: 1,
  })
  applyIfAccountId: number;

  @ApiProperty({
    description: 'The transaction type to apply the rule if',
    example: 'deposit',
    enum: ['deposit', 'withdrawal'],
  })
  applyIfTransactionType: string;

  @ApiProperty({
    description: 'The conditions type to apply the rule if',
    example: 'and',
    enum: ['and', 'or'],
  })
  conditionsType: BankRuleConditionType;

  @ApiProperty({
    description: 'The conditions to apply the rule if',
    type: [BankRuleConditionResponseDto],
    example: [
      {
        id: 1,
        field: 'description',
        comparator: 'contains',
        value: 'Salary',
      },
    ],
  })
  @Type(() => BankRuleConditionResponseDto)
  conditions: BankRuleConditionResponseDto[];

  @ApiProperty({
    description: 'The category to assign the rule if',
    example: 'InterestIncome',
    enum: [
      'InterestIncome',
      'OtherIncome',
      'Deposit',
      'Expense',
      'OwnerDrawings',
    ],
  })
  assignCategory: BankRuleAssignCategory;

  @ApiProperty({
    description: 'The account ID to assign the rule if',
    example: 1,
  })
  assignAccountId: number;

  @ApiProperty({
    description: 'The payee to assign the rule if',
    example: 'Employer Inc.',
    required: false,
  })
  assignPayee?: string;

  @ApiProperty({
    description: 'The memo to assign the rule if',
    example: 'Monthly Salary',
    required: false,
  })
  assignMemo?: string;

  @ApiProperty({
    description: 'The creation timestamp of the bank rule',
    example: '2024-03-20T10:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'The last update timestamp of the bank rule',
    example: '2024-03-20T10:00:00Z',
  })
  updatedAt: string;
}
