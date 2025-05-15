import { Injectable } from '@nestjs/common';
import { getBankAccountTransactionsDefaultQuery } from './_utils';
import { GetBankAccountTransactionsRepository } from './GetBankAccountTransactionsRepo.service';
import { GetBankAccountTransactions } from './GetBankAccountTransactions';
import { ICashflowAccountTransactionsQuery } from '../../types/BankingTransactions.types';

@Injectable()
export class GetBankAccountTransactionsService {
  constructor(
    private readonly getBankAccountTransactionsRepository: GetBankAccountTransactionsRepository,
  ) {}

  /**
   * Retrieve the cashflow account transactions report data.
   * @param {ICashflowAccountTransactionsQuery} query -
   * @return {Promise<IInvetoryItemDetailDOO>}
   */
  public async bankAccountTransactions(
    query: ICashflowAccountTransactionsQuery,
  ) {
    const parsedQuery = {
      ...getBankAccountTransactionsDefaultQuery(),
      ...query,
    };
    this.getBankAccountTransactionsRepository.setQuery(parsedQuery);

    await this.getBankAccountTransactionsRepository.asyncInit();

    // Retrieve the computed report.
    const report = new GetBankAccountTransactions(
      this.getBankAccountTransactionsRepository,
      parsedQuery,
    );
    const transactions = report.reportData();
    const pagination = this.getBankAccountTransactionsRepository.pagination;

    return { transactions, pagination };
  }
}
