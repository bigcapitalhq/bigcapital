import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Matches,
  Min,
} from 'class-validator';

export enum ReconciliationReportStatus {
  Reconciled = 'R',
  Unreconciled = 'U',
}

export class ReconciliationStatusQueryDto {
  @ApiPropertyOptional({ description: 'Bank account ID', type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  accountId?: number;

  @ApiPropertyOptional({
    description: 'First transaction date, inclusive',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'Last transaction date, inclusive',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  toDate?: string;

  @ApiPropertyOptional({
    description:
      'R for reconciled transactions or U for unreconciled transactions',
    enum: ReconciliationReportStatus,
    default: ReconciliationReportStatus.Reconciled,
  })
  @IsOptional()
  @IsEnum(ReconciliationReportStatus)
  status?: ReconciliationReportStatus;
}
