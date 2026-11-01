import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class FinancialSheetBranchesQueryDto {
  @IsArray()
  @IsOptional()
  @ApiProperty({
    description:
      'Filter out branches (if multiple branches feature is enabled)',
    required: false,
    type: [Number],
  })
  branchesIds: Array<number>;
}
