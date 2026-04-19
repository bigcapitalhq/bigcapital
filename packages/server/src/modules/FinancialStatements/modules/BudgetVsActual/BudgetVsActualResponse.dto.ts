import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class BudgetVsActualTotalDto {
  @ApiProperty({ description: 'Amount', example: 5000.0 })
  amount: number;

  @ApiProperty({ description: 'Formatted amount', example: '$5,000.00' })
  formattedAmount: string;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currencyCode: string;
}

class BudgetVsActualPercentageDto {
  @ApiProperty({ description: 'Percentage amount', example: 0.15 })
  amount: number;

  @ApiProperty({ description: 'Formatted percentage', example: '15.00%' })
  formattedAmount: string;
}

class BudgetVsActualDatePeriodDto {
  fromDate: { date: Date; formattedDate: string };
  toDate: { date: Date; formattedDate: string };
  budget: BudgetVsActualTotalDto;
  actual: BudgetVsActualTotalDto;
  variance: BudgetVsActualTotalDto;
  variancePercentage: BudgetVsActualPercentageDto;
}

class BudgetVsActualDataNodeDto {
  @ApiProperty()
  id: string | number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  code?: string;

  @ApiProperty()
  nodeType: string;

  @ApiProperty()
  budget: BudgetVsActualTotalDto;

  @ApiProperty()
  actual: BudgetVsActualTotalDto;

  @ApiProperty()
  variance: BudgetVsActualTotalDto;

  @ApiProperty()
  variancePercentage: BudgetVsActualPercentageDto;

  @ApiPropertyOptional({ type: [BudgetVsActualDataNodeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetVsActualDataNodeDto)
  children?: BudgetVsActualDataNodeDto[];

  @ApiPropertyOptional({ type: [BudgetVsActualDatePeriodDto] })
  horizontalBudgets?: BudgetVsActualDatePeriodDto[];

  @ApiPropertyOptional({ type: [BudgetVsActualDatePeriodDto] })
  horizontalActuals?: BudgetVsActualDatePeriodDto[];

  @ApiPropertyOptional({ type: [BudgetVsActualDatePeriodDto] })
  horizontalVariances?: BudgetVsActualDatePeriodDto[];

  @ApiPropertyOptional({ type: [BudgetVsActualDatePeriodDto] })
  horizontalVariancePercentages?: BudgetVsActualDatePeriodDto[];
}

class BudgetVsActualMetaDto {
  @ApiProperty()
  organizationName: string;

  @ApiProperty()
  baseCurrency: string;

  @ApiProperty()
  dateFormat: string;

  @ApiProperty()
  sheetName: string;

  @ApiProperty()
  budgetName: string;

  @ApiProperty()
  budgetType: string;

  @ApiProperty()
  periodType: string;

  @ApiProperty()
  fromDate: { date: Date; formattedDate: string };

  @ApiProperty()
  toDate: { date: Date; formattedDate: string };
}

export class BudgetVsActualResponseDto {
  @ApiProperty()
  query: any;

  @ApiProperty({ type: [BudgetVsActualDataNodeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetVsActualDataNodeDto)
  data: BudgetVsActualDataNodeDto[];

  @ApiProperty()
  meta: BudgetVsActualMetaDto;
}
