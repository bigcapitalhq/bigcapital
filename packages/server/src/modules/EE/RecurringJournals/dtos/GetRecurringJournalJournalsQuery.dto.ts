import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { ToNumber } from '@/common/decorators/Validators';

export class GetRecurringJournalJournalsQueryDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', type: Number })
  @IsOptional()
  @ToNumber()
  @IsInt()
  page?: number;

  @ApiPropertyOptional({ description: 'Page size', type: Number })
  @IsOptional()
  @ToNumber()
  @IsInt()
  pageSize?: number;
}
