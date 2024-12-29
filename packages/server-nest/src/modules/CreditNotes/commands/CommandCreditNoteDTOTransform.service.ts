import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { omit } from 'lodash';
import * as R from 'ramda';
import composeAsync from 'async/compose';
import { ERRORS } from '../constants';
import {
  ICreditNoteEditDTO,
  ICreditNoteEntryNewDTO,
  ICreditNoteNewDTO,
} from '../types/CreditNotes.types';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { BranchTransactionDTOTransformer } from '@/modules/Branches/integrations/BranchTransactionDTOTransform';
import { WarehouseTransactionDTOTransform } from '@/modules/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { BrandingTemplateDTOTransformer } from '../../PdfTemplate/BrandingTemplateDTOTransformer';
import { assocItemEntriesDefaultIndex } from '@/utils/associate-item-entries-index';
import { CreditNoteAutoIncrementService } from './CreditNoteAutoIncrement.service';
import { CreditNote } from '../models/CreditNote';

@Injectable()
export class CommandCreditNoteDTOTransform {
  /**
   * @param {ItemsEntriesService} itemsEntriesService - The items entries service.
   * @param {BranchTransactionDTOTransformer} branchDTOTransform - The branch transaction DTO transformer.
   * @param {WarehouseTransactionDTOTransform} warehouseDTOTransform - The warehouse transaction DTO transformer.
   * @param {BrandingTemplateDTOTransformer} brandingTemplatesTransformer - The branding template DTO transformer.
   * @param {CreditNoteAutoIncrementService} creditNoteAutoIncrement - The credit note auto increment service.
   */
  constructor(
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly branchDTOTransform: BranchTransactionDTOTransformer,
    private readonly warehouseDTOTransform: WarehouseTransactionDTOTransform,
    private readonly brandingTemplatesTransformer: BrandingTemplateDTOTransformer,
    private readonly creditNoteAutoIncrement: CreditNoteAutoIncrementService
  ) {}

  /**
   * Transformes the credit/edit DTO to model.
   * @param {ICreditNoteNewDTO | ICreditNoteEditDTO} creditNoteDTO
   * @param {string} customerCurrencyCode -
   */
  public transformCreateEditDTOToModel = async (
    creditNoteDTO: ICreditNoteNewDTO | ICreditNoteEditDTO,
    customerCurrencyCode: string,
    oldCreditNote?: CreditNote,
  ): Promise<CreditNote> => {
    // Retrieve the total amount of the given items entries.
    const amount = this.itemsEntriesService.getTotalItemsEntries(
      creditNoteDTO.entries,
    );
    const entries = R.compose(
      // Associate the default index to each item entry.
      assocItemEntriesDefaultIndex,

      // Associate the reference type to credit note entries.
      R.map((entry: ICreditNoteEntryNewDTO) => ({
        ...entry,
        referenceType: 'CreditNote',
      })),
    )(creditNoteDTO.entries);

    // Retreive the next credit note number.
    const autoNextNumber = this.creditNoteAutoIncrement.getNextCreditNumber();

    // Detarmines the credit note number.
    const creditNoteNumber =
      creditNoteDTO.creditNoteNumber ||
      oldCreditNote?.creditNoteNumber ||
      autoNextNumber;

    const initialDTO = {
      ...omit(creditNoteDTO, ['open', 'attachments']),
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
    const initialAsyncDTO = await composeAsync(
      // Assigns the default branding template id to the invoice DTO.
      this.brandingTemplatesTransformer.assocDefaultBrandingTemplate(
        'CreditNote',
      ),
    )(initialDTO);

    return R.compose(
      this.branchDTOTransform.transformDTO<CreditNote>,
      this.warehouseDTOTransform.transformDTO<CreditNote>,
    )(initialAsyncDTO) as CreditNote;
  };

  /**
   * Validate the credit note remaining amount.
   * @param {ICreditNote} creditNote
   * @param {number} amount
   */
  public validateCreditRemainingAmount = (
    creditNote: CreditNote,
    amount: number,
  ) => {
    if (creditNote.creditsRemaining < amount) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_HAS_NO_REMAINING_AMOUNT);
    }
  };
}
