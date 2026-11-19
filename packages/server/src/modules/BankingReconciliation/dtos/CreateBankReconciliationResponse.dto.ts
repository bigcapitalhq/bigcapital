import { ApiProperty } from '@nestjs/swagger';

export class CreateBankReconciliationResponseDto {
  @ApiProperty({ description: 'Created reconciliation id', example: 1 })
  id: number;
}
