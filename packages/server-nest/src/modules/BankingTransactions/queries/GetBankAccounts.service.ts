import { Injectable, Inject } from '@nestjs/common';
import { BankAccount } from '../models/BankAccount';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { CashflowAccountTransformer } from './BankAccountTransformer';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { IBankAccountsFilter } from '../types/BankingTransactions.types';

@Injectable()
export class GetBankAccountsService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(BankAccount.name)
    private readonly bankAccountModel: typeof BankAccount,
  ) {}

  /**
   * Retrieve the cash flow accounts.
   * @param {ICashflowAccountsFilter} filterDTO - Filter DTO.
   * @returns {ICashflowAccount[]}
   */
  public async getBankAccounts(
    filterDTO: IBankAccountsFilter,
  ): Promise<BankAccount[]> {
    // Parsees accounts list filter DTO.
    const filter = this.dynamicListService.parseStringifiedFilter(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      BankAccount,
      filter,
    );
    // Retrieve accounts model based on the given query.
    const accounts = await this.bankAccountModel.query().onBuild((builder) => {
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
