import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { ManualJournalTransfromer } from './ManualJournalTransformer';

@Service()
export class GetManualJournal {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve manual journal details with associated journal transactions.
   * @param {number} tenantId
   * @param {number} manualJournalId
   */
  public getManualJournal = async (tenantId: number, manualJournalId: number) => {
    const { ManualJournal } = this.tenancy.models(tenantId);

    const manualJournal = await ManualJournal.query()
      .findById(manualJournalId)
      .withGraphFetched('entries.account')
      .withGraphFetched('entries.contact')
      .withGraphFetched('entries.branch')
      .withGraphFetched('transactions')
      .withGraphFetched('media')
      .throwIfNotFound();

    return this.transformer.transform(tenantId, manualJournal, new ManualJournalTransfromer());
  };
}
