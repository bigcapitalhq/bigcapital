import { Service, Inject } from 'typedi';
import { omit } from 'lodash';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  ICancelTransactionsLockingDTO,
  ITransactionLockingPartiallyDTO,
  ITransactionMeta,
  ITransactionsLockingAllDTO,
  ITransactionsLockingCanceled,
  ITransactionsLockingPartialUnlocked,
  TransactionsLockingGroup,
  TransactionsLockingType,
} from '@/interfaces';
import TransactionsLockingRepository from './TransactionsLockingRepository';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

const Modules = ['all', 'sales', 'purchases', 'financial'];

@Service()
export default class TransactionsLockingService {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  transactionsLockingRepo: TransactionsLockingRepository;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Enable/disable all  transactions locking.
   * @param   {number} tenantId
   * @param   {TransactionsLockingGroup} moduleGroup -
   * @param   {Partial<ITransactionsLockingAllDTO>} allLockingDTO
   * @returns {Promise<ITransactionMeta>}
   */
  public commandTransactionsLocking = async (
    tenantId: number,
    module: TransactionsLockingGroup = TransactionsLockingGroup.All,
    transactionLockingDTO: Partial<ITransactionsLockingAllDTO>
  ): Promise<ITransactionMeta> => {
    // Validate the transaction locking module.
    this.validateTransactionsLockingModule(module);

    // Saves all transactions locking settings.
    await this.transactionsLockingRepo.saveTransactionsLocking(
      tenantId,
      module,
      {
        active: true,
        lockToDate: transactionLockingDTO.lockToDate,
        lockReason: transactionLockingDTO.reason,
      }
    );
    // Flag transactions locking type.
    await this.transactionsLockingRepo.flagTransactionsLockingType(
      tenantId,
      module === TransactionsLockingGroup.All
        ? TransactionsLockingType.All
        : TransactionsLockingType.Partial
    );
    // Triggers `onTransactionLockingPartialUnlocked` event.
    await this.eventPublisher.emitAsync(
      events.transactionsLocking.partialUnlocked,
      {
        tenantId,
        module,
        transactionLockingDTO,
      } as ITransactionsLockingPartialUnlocked
    );
    // Retrieve the transaction locking meta of the given
    return this.transactionsLockingRepo.getTransactionsLocking(
      tenantId,
      module
    );
  };

  /**
   * Cancels the full transactions locking.
   * @param   {number} tenantId
   * @param   {TransactionsLockingGroup} moduleGroup
   * @param   {ICancelTransactionsLockingDTO} cancelLockingDTO
   * @returns {Promise<ITransactionMeta>}
   */
  public cancelTransactionLocking = async (
    tenantId: number,
    module: TransactionsLockingGroup = TransactionsLockingGroup.All,
    cancelLockingDTO: ICancelTransactionsLockingDTO
  ): Promise<ITransactionMeta> => {
    // Validate the transaction locking module.
    this.validateTransactionsLockingModule(module);

    // Saves transactions locking.
    await this.transactionsLockingRepo.saveTransactionsLocking(
      tenantId,
      module,
      {
        active: false,
        unlockFromDate: '',
        unlockToDate: '',
        unlockReason: cancelLockingDTO.reason,
      }
    );
    // Reset flag transactions locking type to partial.
    await this.transactionsLockingRepo.flagTransactionsLockingType(
      tenantId,
      TransactionsLockingType.Partial
    );
    // Triggers `onTransactionLockingPartialUnlocked` event.
    await this.eventPublisher.emitAsync(
      events.transactionsLocking.partialUnlocked,
      {
        tenantId,
        module,
        cancelLockingDTO,
      } as ITransactionsLockingCanceled
    );
    return this.transactionsLockingRepo.getTransactionsLocking(
      tenantId,
      module
    );
  };

  /**
   * Unlock transactions locking partially.
   * @param   {number} tenantId
   * @param   {TransactionsLockingGroup} moduleGroup
   * @param   {ITransactionLockingPartiallyDTO} partialTransactionLockingDTO
   * @returns {Promise<ITransactionMeta>}
   */
  public unlockTransactionsLockingPartially = async (
    tenantId: number,
    moduleGroup: TransactionsLockingGroup = TransactionsLockingGroup.All,
    partialTransactionLockingDTO: ITransactionLockingPartiallyDTO
  ): Promise<ITransactionMeta> => {
    // Validate the transaction locking module.
    this.validateTransactionsLockingModule(moduleGroup);

    // Retrieve the current transactions locking type.
    const lockingType =
      this.transactionsLockingRepo.getTransactionsLockingType(tenantId);

    if (moduleGroup !== TransactionsLockingGroup.All) {
      this.validateLockingTypeNotAll(lockingType);
    }
    // Saves transactions locking settings.
    await this.transactionsLockingRepo.saveTransactionsLocking(
      tenantId,
      moduleGroup,
      {
        ...omit(partialTransactionLockingDTO, ['reason']),
        partialUnlockReason: partialTransactionLockingDTO.reason,
      }
    );
    // Retrieve transaction locking meta of the given module.
    return this.transactionsLockingRepo.getTransactionsLocking(
      tenantId,
      moduleGroup
    );
  };

  /**
   * Cancel partial transactions unlocking.
   * @param {number} tenantId
   * @param {TransactionsLockingGroup} moduleGroup
   */
  public cancelPartialTransactionsUnlock = async (
    tenantId: number,
    module: TransactionsLockingGroup = TransactionsLockingGroup.All
  ) => {
    // Validate the transaction locking module.
    this.validateTransactionsLockingModule(module);

    // Saves transactions locking settings.
    await this.transactionsLockingRepo.saveTransactionsLocking(
      tenantId,
      module,
      { unlockFromDate: '', unlockToDate: '', partialUnlockReason: '' }
    );
  };

  /**
   * Validates the transaction locking type not partial.
   * @param {number} tenantId
   */
  public validateLockingTypeNotPartial = (lockingType: string) => {
    if (lockingType === TransactionsLockingType.Partial) {
      throw new ServiceError(ERRORS.TRANSACTION_LOCKING_PARTIAL);
    }
  };

  /**
   * Validates the transaction locking type not all.
   * @param {number} tenantId
   */
  public validateLockingTypeNotAll = (lockingType: string) => {
    if (lockingType === TransactionsLockingType.All) {
      throw new ServiceError(ERRORS.TRANSACTION_LOCKING_ALL);
    }
  };

  /**
   * Validate transactions locking module.
   * @param {string} module
   */
  public validateTransactionsLockingModule = (module: string) => {
    if (Modules.indexOf(module) === -1) {
      throw new ServiceError(ERRORS.TRANSACTIONS_LOCKING_MODULE_NOT_FOUND);
    }
  };
}
