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

class BankRuleConditionDto {
  @IsNotEmpty()
  @IsIn(['description', 'amount'])
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
  name: string;

  @IsInt()
  @Min(0)
  order: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  applyIfAccountId?: number;

  @IsIn(['deposit', 'withdrawal'])
  applyIfTransactionType: 'deposit' | 'withdrawal';

  @IsString()
  @IsIn(['and', 'or'])
  conditionsType: 'and' | 'or' = 'and';

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BankRuleConditionDto)
  conditions: BankRuleConditionDto[];

  @IsString()
  assignCategory: string;

  @IsInt()
  @Min(0)
  assignAccountId: number;

  @IsOptional()
  @IsString()
  assignPayee?: string;

  @IsOptional()
  @IsString()
  assignMemo?: string;
}

export class CreateBankRuleDto extends CommandBankRuleDto {}
export class EditBankRuleDto extends CommandBankRuleDto {}
