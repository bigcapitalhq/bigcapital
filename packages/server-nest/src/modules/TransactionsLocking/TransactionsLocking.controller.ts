import { Controller, Put, Get, Body, Param, UseGuards } from '@nestjs/common';
import { TransactionsLockingService } from './commands/CommandTransactionsLockingService';
import { TransactionsLockingGroup } from './types/TransactionsLocking.types';
import { ITransactionsLockingAllDTO } from './types/TransactionsLocking.types';
import { ICancelTransactionsLockingDTO } from './types/TransactionsLocking.types';
import { ITransactionLockingPartiallyDTO } from './types/TransactionsLocking.types';
import { QueryTransactionsLocking } from './queries/QueryTransactionsLocking';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('transactions-locking')
@PublicRoute()
export class TransactionsLockingController {
  constructor(
    private readonly transactionsLockingService: TransactionsLockingService,
    private readonly queryTransactionsLocking: QueryTransactionsLocking,
  ) {}

  @Put('lock')
  async commandTransactionsLocking(
    @Body('module') module: TransactionsLockingGroup,
    @Body() transactionLockingDTO: ITransactionsLockingAllDTO,
  ) {
    const transactionMeta =
      await this.transactionsLockingService.commandTransactionsLocking(
        module,
        transactionLockingDTO,
      );
    return {
      message: 'All transactions locking has been submit successfully.',
      data: transactionMeta,
    };
  }

  @Put('cancel-lock')
  async cancelTransactionLocking(
    @Body('module') module: TransactionsLockingGroup,
    @Body() cancelLockingDTO: ICancelTransactionsLockingDTO,
  ) {
    const data = await this.transactionsLockingService.cancelTransactionLocking(
      module,
      cancelLockingDTO,
    );
    return {
      message: 'Transactions locking has been canceled successfully.',
      data,
    };
  }

  @Put('unlock-partial')
  async unlockTransactionsLockingBetweenPeriod(
    @Body('module') module: TransactionsLockingGroup,
    @Body() unlockDTO: ITransactionLockingPartiallyDTO,
  ) {
    const transactionMeta =
      await this.transactionsLockingService.unlockTransactionsLockingPartially(
        module,
        unlockDTO,
      );
    return {
      message: 'Transactions locking has been unlocked partially successfully.',
      data: transactionMeta,
    };
  }

  @Put('cancel-unlock-partial')
  async cancelPartialUnlocking(
    @Body('module') module: TransactionsLockingGroup,
  ) {
    const transactionMeta =
      await this.transactionsLockingService.cancelPartialTransactionsUnlock(
        module,
      );
    return {
      message: 'Partial transaction unlocking has been canceled successfully.',
      data: transactionMeta,
    };
  }

  @Get('/')
  async getTransactionLockingMetaList() {
    return await this.queryTransactionsLocking.getTransactionsLockingAll();
  }

  @Get(':module')
  async getTransactionLockingMeta(@Param('module') module: string) {
    return await this.queryTransactionsLocking.getTransactionsLockingModuleMeta(
      module as TransactionsLockingGroup,
    );
  }
}
