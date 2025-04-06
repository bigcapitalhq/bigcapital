import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { IsDate } from 'class-validator';

export class TransactionsLockingDto {
  @IsDate()
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
