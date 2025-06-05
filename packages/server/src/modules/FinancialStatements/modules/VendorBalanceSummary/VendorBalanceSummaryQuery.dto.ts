import { IsArray, IsOptional } from 'class-validator';
import { ContactBalanceSummaryQueryDto } from '../ContactBalanceSummary/ContactBalanceSummaryQuery.dto';

export class VendorBalanceSummaryQueryDto extends ContactBalanceSummaryQueryDto {
  @IsArray()
  @IsOptional()
  vendorsIds: number[];
}
