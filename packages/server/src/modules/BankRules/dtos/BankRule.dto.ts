import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  Min,
  IsOptional,
  IsIn,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsNotEmpty,
} from 'class-validator';
import { BankRuleComparator } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { ToNumber } from '@/common/decorators/Validators';

class BankRuleConditionDto {
  @IsNotEmpty()
  @IsIn(['description', 'amount', 'payee'])
  field: string;

  @IsNotEmpty()
  @IsIn([
    'equals',
    'equal',
    'contains',
    'not_contain',
    'bigger',
    'bigger_or_equal',
    'smaller',
    'smaller_or_equal',
  ])
  comparator: BankRuleComparator = 'contains';

  @IsNotEmpty()
  value: string;
}

export class CommandBankRuleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the bank rule',
    example: 'Monthly Salary',
  })
  name: string;

  @IsNotEmpty()
  @ToNumber()
  @IsInt()
  @Min(0)
  @ApiProperty({
    description: 'The order of the bank rule',
    example: 1,
  })
  order: number;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(0)
  @ApiProperty({
    description: 'The account ID to apply the rule if',
    example: 1,
  })
  applyIfAccountId?: number;

  @IsNotEmpty()
  @IsIn(['deposit', 'withdrawal'])
  @ApiProperty({
    description: 'The transaction type to apply the rule if',
    example: 'deposit',
  })
  applyIfTransactionType: 'deposit' | 'withdrawal';

  @IsString()
  @IsIn(['and', 'or'])
  @ApiProperty({
    description: 'The conditions type to apply the rule if',
    example: 'and',
  })
  conditionsType: 'and' | 'or' = 'and';

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BankRuleConditionDto)
  @ApiProperty({
    description: 'The conditions to apply the rule if',
    example: [
      { field: 'description', comparator: 'contains', value: 'Salary' },
    ],
  })
  conditions: BankRuleConditionDto[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The category to assign the rule if',
    example: 'Income:Salary',
  })
  assignCategory: string;

  @IsInt()
  @Min(0)
  @ToNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The account ID to assign the rule if',
    example: 1,
  })
  assignAccountId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The payee to assign the rule if',
    example: 'Employer Inc.',
  })
  assignPayee?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The memo to assign the rule if',
    example: 'Monthly Salary',
  })
  assignMemo?: string;
}

export class CreateBankRuleDto extends CommandBankRuleDto {}
export class EditBankRuleDto extends CommandBankRuleDto {}
