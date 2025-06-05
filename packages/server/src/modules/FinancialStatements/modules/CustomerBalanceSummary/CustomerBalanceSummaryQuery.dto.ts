import { IsArray, IsOptional } from 'class-validator';
import { ContactBalanceSummaryQueryDto } from '../ContactBalanceSummary/ContactBalanceSummaryQuery.dto';

export class CustomerBalanceSummaryQueryDto extends ContactBalanceSummaryQueryDto {
  @IsArray()
  @IsOptional()
  customersIds: number[];
}
