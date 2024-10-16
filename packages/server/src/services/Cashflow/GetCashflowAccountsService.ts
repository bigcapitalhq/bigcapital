import { Service, Inject } from 'typedi';
import { ICashflowAccount, ICashflowAccountsFilter } from '@/interfaces';
import { CashflowAccountTransformer } from './CashflowAccountTransformer';
import TenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';

@Service()
export default class GetCashflowAccountsService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the cash flow accounts.
   * @param {number} tenantId - Tenant id.
   * @param {ICashflowAccountsFilter} filterDTO - Filter DTO.
   * @returns {ICashflowAccount[]}
   */
  public async getCashflowAccounts(
    tenantId: number,
    filterDTO: ICashflowAccountsFilter
  ): Promise<{ cashflowAccounts: ICashflowAccount[] }> {
    const { CashflowAccount } = this.tenancy.models(tenantId);

    // Parsees accounts list filter DTO.
    const filter = this.dynamicListService.parseStringifiedFilter(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      tenantId,
      CashflowAccount,
      filter
    );
    // Retrieve accounts model based on the given query.
    const accounts = await CashflowAccount.query().onBuild((builder) => {
      dynamicList.buildQuery()(builder);

      builder.whereIn('account_type', [
        ACCOUNT_TYPE.BANK,
        ACCOUNT_TYPE.CASH,
        ACCOUNT_TYPE.CREDIT_CARD,
      ]);
      builder.modify('inactiveMode', filter.inactiveMode);
    });
    // Retrieves the transformed accounts.
    const transformed = await this.transformer.transform(
      tenantId,
      accounts,
      new CashflowAccountTransformer()
    );

    return transformed;
  }
}
