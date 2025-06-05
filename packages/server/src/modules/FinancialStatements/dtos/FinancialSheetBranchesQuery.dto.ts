import { IsArray, IsOptional } from "class-validator";

export class FinancialSheetBranchesQueryDto {
  @IsArray()
  @IsOptional()
  branchesIds: Array<number>;
}