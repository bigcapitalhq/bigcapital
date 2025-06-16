import {
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Put, Get, Body, Param } from '@nestjs/common';
import { TransactionsLockingService } from './commands/CommandTransactionsLockingService';
import { TransactionsLockingGroup } from './types/TransactionsLocking.types';
import { ITransactionLockingPartiallyDTO } from './types/TransactionsLocking.types';
import { QueryTransactionsLocking } from './queries/QueryTransactionsLocking';
import {
  CancelTransactionsLockingDto,
  TransactionsLockingDto,
} from './dtos/TransactionsLocking.dto';
import { TransactionLockingResponseDto } from './dtos/TransactionLockingResponse.dto';

@Controller('transactions-locking')
@ApiTags('Transactions Locking')
@ApiExtraModels(TransactionLockingResponseDto)
export class TransactionsLockingController {
  constructor(
    private readonly transactionsLockingService: TransactionsLockingService,
    private readonly queryTransactionsLocking: QueryTransactionsLocking,
  ) {}

  @Put('lock')
  @ApiOperation({
    summary: 'Lock all transactions for a module or all modules',
  })
  @ApiResponse({
    status: 200,
    description: 'The transactions have been successfully locked.',
    schema: {
      $ref: getSchemaPath(TransactionLockingResponseDto),
    },
  })
  async commandTransactionsLocking(
    @Body('module') module: TransactionsLockingGroup,
    @Body() transactionLockingDTO: TransactionsLockingDto,
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
  @ApiOperation({
    summary: 'Cancel all transactions locking for a module or all modules',
  })
  @ApiResponse({
    status: 200,
    description: 'The transactions locking has been successfully canceled.',
    schema: {
      $ref: getSchemaPath(TransactionLockingResponseDto),
    },
  })
  async cancelTransactionLocking(
    @Body('module') module: TransactionsLockingGroup,
    @Body() cancelLockingDTO: CancelTransactionsLockingDto,
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
  @ApiOperation({
    summary:
      'Partial unlock all transactions locking for a module or all modules',
  })
  @ApiResponse({
    status: 200,
    description: 'The transactions have been successfully partially unlocked.',
    schema: {
      $ref: getSchemaPath(TransactionLockingResponseDto),
    },
  })
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
  @ApiOperation({
    summary:
      'Cancel partial unlocking all transactions locking for a module or all modules',
  })
  @ApiResponse({
    status: 200,
    description:
      'The partial transaction unlocking has been successfully canceled.',
    schema: {
      $ref: getSchemaPath(TransactionLockingResponseDto),
    },
  })
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
  @ApiOperation({ summary: 'Get all transactions locking meta' })
  @ApiResponse({
    status: 200,
    description:
      'The transactions locking meta has been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(TransactionLockingResponseDto),
    },
  })
  async getTransactionLockingMetaList() {
    return await this.queryTransactionsLocking.getTransactionsLockingList();
  }

  @Get(':module')
  @ApiOperation({ summary: 'Get transactions locking meta for a module' })
  @ApiResponse({
    status: 200,
    description:
      'The module transactions locking meta has been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(TransactionLockingResponseDto),
    },
  })
  async getTransactionLockingMeta(@Param('module') module: string) {
    return await this.queryTransactionsLocking.getTransactionsLockingModuleMeta(
      module as TransactionsLockingGroup,
    );
  }
}
