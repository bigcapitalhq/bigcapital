import { Injectable } from '@nestjs/common';
import { getBankAccountTransactionsDefaultQuery } from './_utils';
import { GetBankAccountTransactionsRepository } from './GetBankAccountTransactionsRepo.service';
import { GetBankAccountTransactions } from './GetBankAccountTransactions';
import { GetBankTransactionsQueryDto } from '../../dtos/GetBankTranasctionsQuery.dto';
import { I18nService } from 'nestjs-i18n';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class GetBankAccountTransactionsService {
  constructor(
    private readonly getBankAccountTransactionsRepository: GetBankAccountTransactionsRepository,
    private readonly i18nService: I18nService,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Retrieve the cashflow account transactions report data.
   * @param {ICashflowAccountTransactionsQuery} query -
   * @return {Promise<IInvetoryItemDetailDOO>}
   */
  public async bankAccountTransactions(query: GetBankTransactionsQueryDto) {
    const parsedQuery = {
      ...getBankAccountTransactionsDefaultQuery(),
      ...query,
    };
    this.getBankAccountTransactionsRepository.setQuery(parsedQuery);

    await this.getBankAccountTransactionsRepository.asyncInit();

    // Retrieve the tenant metadata to get the date format.
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const dateFormat = tenantMetadata?.dateFormat;

    // Retrieve the computed report.
    const report = new GetBankAccountTransactions(
      this.getBankAccountTransactionsRepository,
      parsedQuery,
      this.i18nService,
      dateFormat,
    );
    const transactions = report.reportData();
    const pagination = this.getBankAccountTransactionsRepository.pagination;

    return { transactions, pagination };
  }
}
