import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import * as R from 'ramda';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IRefundVendorCreditCreatedPayload,
  IRefundVendorCreditCreatingPayload,
} from '../types/VendorCreditRefund.types';
import { Account } from '@/modules/Accounts/models/Account.model';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { RefundVendorCredit } from '../models/RefundVendorCredit';
import { BranchTransactionDTOTransformer } from '@/modules/Branches/integrations/BranchTransactionDTOTransform';
import { IVendorCreditCreatePayload } from '@/modules/VendorCredit/types/VendorCredit.types';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { RefundVendorCreditDto } from '../dtos/RefundVendorCredit.dto';

@Injectable()
export class CreateRefundVendorCredit {
  /**
   * @param {UnitOfWork} uow - Unit of work.
   * @param {EventEmitter2} eventPublisher - Event emitter.
   * @param {BranchTransactionDTOTransformer} branchDTOTransform - Branch transaction DTO transformer.
   * @param {TenantModelProxy<typeof RefundVendorCredit>} refundVendorCreditModel - Refund vendor credit model.
   * @param {TenantModelProxy<typeof Account>} accountModel - Account model.
   * @param {TenantModelProxy<typeof VendorCredit>} vendorCreditModel - Vendor credit model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly branchDTOTransform: BranchTransactionDTOTransformer,

    @Inject(RefundVendorCredit.name)
    private readonly refundVendorCreditModel: TenantModelProxy<
      typeof RefundVendorCredit
    >,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: TenantModelProxy<typeof VendorCredit>,
  ) {}

  /**
   * Creates a refund vendor credit.
   * @param {number} vendorCreditId
   * @param {RefundVendorCreditDto} refundVendorCreditDTO
   * @returns {Promise<IRefundVendorCredit>}
   */
  public createRefund = async (
    vendorCreditId: number,
    refundVendorCreditDTO: RefundVendorCreditDto,
  ): Promise<RefundVendorCredit> => {
    // Retrieve the vendor credit or throw not found service error.
    const vendorCredit = await this.vendorCreditModel()
      .query()
      .findById(vendorCreditId)
      .throwIfNotFound();

    // Retrieve the deposit account or throw not found service error.
    const depositAccount = await this.accountModel()
      .query()
      .findById(refundVendorCreditDTO.depositAccountId)
      .throwIfNotFound();

    // Validate vendor credit has remaining credit.
    this.validateVendorCreditRemainingCredit(
      vendorCredit,
      refundVendorCreditDTO.amount,
    );
    // Validate refund deposit account type.
    this.validateRefundDepositAccountType(depositAccount);

    // Triggers `onVendorCreditRefundCreate` event.
    await this.eventPublisher.emitAsync(events.vendorCredit.onRefundCreate, {
      vendorCreditId,
      refundVendorCreditDTO,
    } as IVendorCreditCreatePayload);

    const refundCreditObj = this.transformDTOToModel(
      vendorCredit,
      refundVendorCreditDTO,
    );
    // Saves refund vendor credit with associated transactions.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const eventPayload = {
        vendorCredit,
        trx,
        refundVendorCreditDTO,
      } as IRefundVendorCreditCreatingPayload;

      // Triggers `onVendorCreditRefundCreating` event.
      await this.eventPublisher.emitAsync(
        events.vendorCredit.onRefundCreating,
        eventPayload as IRefundVendorCreditCreatingPayload,
      );
      // Inserts refund vendor credit to the storage layer.
      const refundVendorCredit = await this.refundVendorCreditModel()
        .query()
        .insertAndFetch(refundCreditObj);

      // Triggers `onVendorCreditCreated` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onRefundCreated, {
        ...eventPayload,
        refundVendorCredit,
      } as IRefundVendorCreditCreatedPayload);

      return refundVendorCredit;
    });
  };

  /**
   * Transformes the refund DTO to refund vendor credit model.
   * @param {VendorCredit} vendorCredit -
   * @param {RefundVendorCreditDto} vendorCreditDTO
   * @returns {IRefundVendorCredit}
   */
  public transformDTOToModel = (
    vendorCredit: VendorCredit,
    vendorCreditDTO: RefundVendorCreditDto,
  ) => {
    const initialDTO = {
      vendorCreditId: vendorCredit.id,
      ...vendorCreditDTO,
      currencyCode: vendorCredit.currencyCode,
      exchangeRate: vendorCreditDTO.exchangeRate || 1,
    };
    return R.compose(this.branchDTOTransform.transformDTO)(initialDTO);
  };

  /**
   * Validate the deposit refund account type.
   * @param {Account} account
   */
  public validateRefundDepositAccountType(account: Account) {
    const supportedTypes = ['bank', 'cash', 'fixed-asset'];

    if (supportedTypes.indexOf(account.accountType) === -1) {
      throw new ServiceError(ERRORS.DEPOSIT_ACCOUNT_INVALID_TYPE);
    }
  }

  /**
   * Validate vendor credit has remaining credits.
   * @param {VendorCredit} vendorCredit
   * @param {number} amount
   */
  public validateVendorCreditRemainingCredit(
    vendorCredit: VendorCredit,
    amount: number,
  ) {
    if (vendorCredit.creditsRemaining < amount) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_HAS_NO_CREDITS_REMAINING);
    }
  }
}
