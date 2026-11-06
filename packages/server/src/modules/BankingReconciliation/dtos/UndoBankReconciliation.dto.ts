import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UndoBankReconciliationDto {
  @ApiPropertyOptional({
    description:
      'Also void later reconciliations when this is not the latest one',
    example: true,
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  cascade?: boolean = false;
}
