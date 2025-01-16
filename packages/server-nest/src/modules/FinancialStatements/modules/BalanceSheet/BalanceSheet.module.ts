import { Module } from '@nestjs/common';
import { BalanceSheetInjectable } from './BalanceSheetInjectable';
import { BalanceSheetApplication } from './BalanceSheetApplication';

@Module({
  providers: [BalanceSheetInjectable, BalanceSheetApplication],
  exports: [BalanceSheetInjectable],
})
export class BalanceSheetModule {}
