import { omit } from 'lodash';
import {
  ITransactionLockingPartiallyDTO,
  ITransactionMeta,
  ITransactionsLockingAllDTO,
  ITransactionsLockingCanceled,
  ITransactionsLockingPartialUnlocked,
  TransactionsLockingGroup,
  TransactionsLockingType,
} from '../types/TransactionsLocking.types';
import { TransactionsLockingRepository } from '../TransactionsLockingRepository';
import { ERRORS } from '../constants';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import {
  CancelTransactionsLockingDto,
  TransactionsLockingDto,
} from '../dtos/TransactionsLocking.dto';

const Modules = ['all', 'sales', 'purchases', 'financial'];

@Injectable()
export class TransactionsLockingService {
  constructor(
    private readonly transactionsLockingRepo: TransactionsLockingRepository,
    private readonly eventPublisher: EventEmitter2,
  ) { }

  /**
   * Enable/disable all transacations locking.
   * @param {TransactionsLockingGroup} module - The transaction locking module.
   * @param {Partial<ITransactionsLockingAllDTO>} allLockingDTO
   * @returns {Promise<ITransactionMeta>}
   */
  public commandTransactionsLocking = async (
    module: TransactionsLockingGroup = TransactionsLockingGroup.All,
    transactionLockingDTO: TransactionsLockingDto,
  ): Promise<ITransactionMeta> => {
    // Validate the transaction locking module.
    this.validateTransactionsLockingModule(module);

    // Saves all transactions locking settings.
    await this.transactionsLockingRepo.saveTransactionsLocking(module, {
      active: true,
      lockToDate: transactionLockingDTO.lockToDate,
      lockReason: transactionLockingDTO.reason,
    });
    // Flag transactions locking type.
    await this.transactionsLockingRepo.flagTransactionsLockingType(
      module === TransactionsLockingGroup.All
        ? TransactionsLockingType.All
        : TransactionsLockingType.Partial,
    );
    // Triggers `onTransactionLockingPartialUnlocked` event.
    await this.eventPublisher.emitAsync(
      events.transactionsLocking.partialUnlocked,
      {
        module,
        transactionLockingDTO,
      } as ITransactionsLockingPartialUnlocked,
    );
    // Retrieve the transaction locking meta of the given
    return this.transactionsLockingRepo.getTransactionsLocking(module);
  };

  /**
   * Cancels the full transactions locking.
   * @param {TransactionsLockingGroup} module - The transaction locking module.
   * @param {ICancelTransactionsLockingDTO} cancelLockingDTO
   * @returns {Promise<ITransactionMeta>}
   */
  public cancelTransactionLocking = async (
    module: TransactionsLockingGroup = TransactionsLockingGroup.All,
    cancelLockingDTO: CancelTransactionsLockingDto,
  ): Promise<ITransactionMeta> => {
    // Validate the transaction locking module.
    this.validateTransactionsLockingModule(module);

    // Saves transactions locking.
    await this.transactionsLockingRepo.saveTransactionsLocking(module, {
      active: false,
      unlockFromDate: '',
      unlockToDate: '',
      unlockReason: cancelLockingDTO.reason,
    });
    // Reset flag transactions locking type to partial.
    await this.transactionsLockingRepo.flagTransactionsLockingType(
      TransactionsLockingType.Partial,
    );
    // Triggers `onTransactionLockingPartialUnlocked` event.
    await this.eventPublisher.emitAsync(
      events.transactionsLocking.partialUnlocked,
      {
        module,
        cancelLockingDTO,
      } as ITransactionsLockingCanceled,
    );
    return this.transactionsLockingRepo.getTransactionsLocking(module);
  };

  /**
   * Unlock tranactions locking partially.
   * @param   {TransactionsLockingGroup} module - The transaction locking module.
   * @param   {ITransactionLockingPartiallyDTO} partialTransactionLockingDTO
   * @returns {Promise<ITransactionMeta>}
   */
  public unlockTransactionsLockingPartially = async (
    moduleGroup: TransactionsLockingGroup = TransactionsLockingGroup.All,
    partialTransactionLockingDTO: ITransactionLockingPartiallyDTO,
  ): Promise<ITransactionMeta> => {
    // Validate the transaction locking module.
    this.validateTransactionsLockingModule(moduleGroup);

    // Retrieve the current transactions locking type.
    const lockingType =
      await this.transactionsLockingRepo.getTransactionsLockingType();

    if (moduleGroup !== TransactionsLockingGroup.All) {
      this.validateLockingTypeNotAll(lockingType);
    }
    // Saves transactions locking settings.
    await this.transactionsLockingRepo.saveTransactionsLocking(moduleGroup, {
      ...omit(partialTransactionLockingDTO, ['reason']),
      partialUnlockReason: partialTransactionLockingDTO.reason,
    });
    // Retrieve transaction locking meta of the given module.
    return this.transactionsLockingRepo.getTransactionsLocking(moduleGroup);
  };

  /**
   * Cancel partial transactions unlocking.
   * @param {TransactionsLockingGroup} module - The transaction locking module.
   */
  public cancelPartialTransactionsUnlock = async (
    module: TransactionsLockingGroup = TransactionsLockingGroup.All,
  ) => {
    // Validate the transaction locking module.
    this.validateTransactionsLockingModule(module);

    // Saves transactions locking settings.
    await this.transactionsLockingRepo.saveTransactionsLocking(module, {
      unlockFromDate: '',
      unlockToDate: '',
      partialUnlockReason: '',
    });
  };

  /**
   * Validates the transaction locking type not partial.
   * @param {string} lockingType - The transaction locking type.
   */
  public validateLockingTypeNotPartial = (lockingType: string) => {
    if (lockingType === TransactionsLockingType.Partial) {
      throw new ServiceError(ERRORS.TRANSACTION_LOCKING_PARTIAL);
    }
  };

  /**
   * Validates the transaction locking type not all.
   * @param {string} lockingType - The transaction locking type.
   */
  public validateLockingTypeNotAll = (lockingType: string) => {
    if (lockingType === TransactionsLockingType.All) {
      throw new ServiceError(ERRORS.TRANSACTION_LOCKING_ALL);
    }
  };

  /**
   * Validate transactions locking module.
   * @param {string} module - The transaction locking module.
   */
  public validateTransactionsLockingModule = (module: string) => {
    if (Modules.indexOf(module) === -1) {
      throw new ServiceError(ERRORS.TRANSACTIONS_LOCKING_MODULE_NOT_FOUND);
    }
  };
}
