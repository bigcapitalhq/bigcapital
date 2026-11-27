import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { ToNumber } from '@/common/decorators/Validators';

export class GetBudgetPrefillQueryDto {
  @ApiProperty({
    description: 'Budget start date',
    example: '2024-01-01',
  })
  @IsDateString()
  fromDate: string;

  @ApiProperty({
    description: 'Budget end date',
    example: '2024-12-31',
  })
  @IsDateString()
  toDate: string;

  @ApiPropertyOptional({
    description:
      'The year to source the actual amounts from. Defaults to the year before the budget start date.',
    example: 2023,
  })
  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(1900)
  sourceYear?: number;
}
