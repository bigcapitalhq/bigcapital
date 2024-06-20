import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetMatchedTransactionManualJournalsTransformer } from './GetMatchedTransactionManualJournalsTransformer';
import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GetMatchedTransactionsFilter } from './types';

@Service()
export class GetMatchedTransactionsByManualJournals {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    const manualJournals = await ManualJournal.query();

    return this.transformer.transform(
      tenantId,
      manualJournals,
      new GetMatchedTransactionManualJournalsTransformer()
    );
  }
}
