import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Length } from 'class-validator';

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

  // Manual override for the per-connection webhook signature key. Normally
  // populated automatically when we register the subscription with Square's
  // webhook subscriptions API at OAuth time; admins can paste a different
  // key here if auto-registration failed or the subscription was rotated
  // out-of-band in the Square Developer Dashboard.
  @IsString()
  @Length(16, 128)
  @IsOptional()
  @ApiProperty({ required: false })
  webhookSignatureKey?: string;
}
