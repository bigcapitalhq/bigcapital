import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { IsDate } from 'class-validator';

export class TransactionsLockingDto {
  @IsString()
  module: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  lockToDate: Date;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class CancelTransactionsLockingDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class UnlockTransactionsLockingDto {
  @IsDate()
  @IsNotEmpty()
  unlockFromDate: Date;
}
