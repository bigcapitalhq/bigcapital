import { IsArray, IsOptional } from 'class-validator';
import { TransactionsByContactQueryDto } from '../TransactionsByContact/TransactionsByContactQuery.dto';

export class TransactionsByVendorQueryDto extends TransactionsByContactQueryDto {
  @IsArray()
  @IsOptional()
  vendorsIds: number[];
}
