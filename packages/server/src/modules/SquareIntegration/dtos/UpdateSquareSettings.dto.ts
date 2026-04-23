import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';

const toInt = () =>
  Transform(({ value }) =>
    value === '' || value == null ? null : Number(value),
  );

export class UpdateSquareSettingsDto {
  @toInt()
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  clearingAccountId?: number;

  @toInt()
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  feesExpenseAccountId?: number;

  @toInt()
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  tipsLiabilityAccountId?: number;

  @toInt()
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  walkInCustomerId?: number;

  @toInt()
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  depositBankAccountId?: number;

  @IsIn(['pending', 'active', 'disabled'])
  @IsOptional()
  @ApiProperty({ required: false, enum: ['pending', 'active', 'disabled'] })
  status?: 'pending' | 'active' | 'disabled';
}
