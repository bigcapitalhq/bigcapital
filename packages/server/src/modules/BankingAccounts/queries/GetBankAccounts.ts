import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { Account } from '@/modules/Accounts/models/Account.model';
import { CashflowAccountTransformer } from '@/modules/BankingTransactions/queries/BankAccountTransformer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ICashflowAccountsFilter } from '../types/BankAccounts.types';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { BankAccountsQueryDto } from '../dtos/BankAccountsQuery.dto';
import { IDynamicListFilter } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';

@Injectable()
export class GetBankAccountsService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) { }

  /**
   * Retrieve the cash flow accounts.
   * @param {ICashflowAccountsFilter} filterDTO - Filter DTO.
   * @returns {ICashflowAccount[]}
   */
  public async getCashflowAccounts(filterDTO: BankAccountsQueryDto) {
    const _filterDto = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      inactiveMode: false,
      ...filterDTO,
    };
    // Parsees accounts list filter DTO.
    const filter = this.dynamicListService.parseStringifiedFilter<BankAccountsQueryDto>(
      _filterDto,
    );

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      this.accountModel(),
      filter as IDynamicListFilter,
    );
    // Retrieve accounts model based on the given query.
    const accounts = await this.accountModel()
      .query()
      .onBuild((builder) => {
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
      accounts,
      new CashflowAccountTransformer(),
    );

    return transformed;
  }
}
