import { IsArray, IsOptional } from 'class-validator';
import { TransactionsByContactQueryDto } from '../TransactionsByContact/TransactionsByContactQuery.dto';

export class TransactionsByCustomerQueryDto extends TransactionsByContactQueryDto {
  @IsArray()
  @IsOptional()
  customersIds: number[];
}
