import { Service, Inject } from 'typedi';
import moment from 'moment';
import { omit } from 'lodash';
import * as R from 'ramda';
import { ServiceError } from '@/exceptions';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ERRORS } from './constants';
import { ICreditNote, ICreditNoteEditDTO, ICreditNoteNewDTO } from '@/interfaces';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import AutoIncrementOrdersService from '@/services/Sales/AutoIncrementOrdersService';
import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';

@Service()
export default class BaseCreditNotes {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private autoIncrementOrdersService: AutoIncrementOrdersService;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private warehouseDTOTransform: WarehouseTransactionDTOTransform;

  /**
   * Transforms the credit/edit DTO to model.
   * @param {ICreditNoteNewDTO | ICreditNoteEditDTO} creditNoteDTO
   * @param {string} customerCurrencyCode -
   */
  protected transformCreateEditDTOToModel = (
    tenantId: number,
    creditNoteDTO: ICreditNoteNewDTO | ICreditNoteEditDTO,
    customerCurrencyCode: string,
    oldCreditNote?: ICreditNote
  ): ICreditNote => {
    // Retrieve the total amount of the given items entries.
    const amount = this.itemsEntriesService.getTotalItemsEntries(
      creditNoteDTO.entries
    );
    const entries = creditNoteDTO.entries.map((entry) => ({
      ...entry,
      referenceType: 'CreditNote',
    }));
    // Retrieve the next credit note number.
    const autoNextNumber = this.getNextCreditNumber(tenantId);

    // Determines the credit note number.
    const creditNoteNumber =
      creditNoteDTO.creditNoteNumber ||
      oldCreditNote?.creditNoteNumber ||
      autoNextNumber;

    const initialDTO = {
      ...omit(creditNoteDTO, ['open']),
      creditNoteNumber,
      amount,
      currencyCode: customerCurrencyCode,
      exchangeRate: creditNoteDTO.exchangeRate || 1,
      entries,
      ...(creditNoteDTO.open &&
        !oldCreditNote?.openedAt && {
          openedAt: moment().toMySqlDateTime(),
        }),
      refundedAmount: 0,
      invoicesAmount: 0,
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<ICreditNote>(tenantId),
      this.warehouseDTOTransform.transformDTO<ICreditNote>(tenantId)
    )(initialDTO);
  };

  /**
   * Retrieve the given credit note or throw not found service error.
   * @param {number} tenantId -
   * @param {number} creditNoteId -
   */
  protected getCreditNoteOrThrowError = async (
    tenantId: number,
    creditNoteId: number
  ) => {
    const { CreditNote } = this.tenancy.models(tenantId);

    const creditNote = await CreditNote.query().findById(creditNoteId);

    if (!creditNote) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_NOT_FOUND);
    }
    return creditNote;
  };

  /**
   * Retrieve the next unique credit number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  private getNextCreditNumber = (tenantId: number): string => {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'credit_note'
    );
  };

  /**
   * Increment the credit note serial next number.
   * @param {number} tenantId -
   */
  public incrementSerialNumber = (tenantId: number) => {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'credit_note'
    );
  };

  /**
   * Validate the credit note remaining amount.
   * @param {ICreditNote} creditNote
   * @param {number} amount
   */
  public validateCreditRemainingAmount = (
    creditNote: ICreditNote,
    amount: number
  ) => {
    if (creditNote.creditsRemaining < amount) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_HAS_NO_REMAINING_AMOUNT);
    }
  };
}
