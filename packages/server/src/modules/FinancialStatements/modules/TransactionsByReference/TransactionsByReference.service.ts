import { Injectable } from '@nestjs/common';
import { ITransactionsByReferencePojo } from './TransactionsByReference.types';
import { TransactionsByReferenceRepository } from './TransactionsByReferenceRepository';
import { TransactionsByReference } from './TransactionsByReferenceReport';
import { getTransactionsByReferenceQuery } from './_utils';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TransactionsByReferenceQueryDto } from './TransactionsByReferenceQuery.dto';
import { AccountingBasisService } from '../../common/AccountingBasisService';

@Injectable()
export class TransactionsByReferenceService {
  constructor(
    private readonly repository: TransactionsByReferenceRepository,
    private readonly tenancyContext: TenancyContext,
    private readonly accountingBasisService: AccountingBasisService,
  ) {}

  /**
   * Retrieve accounts transactions by given reference id and type.
   * @param {TransactionsByReferenceQueryDto} filter - Transactions by reference query.
   * @returns {Promise<ITransactionsByReferencePojo>}
   */
  public async getTransactionsByReference(
    query: TransactionsByReferenceQueryDto,
  ): Promise<ITransactionsByReferencePojo> {
    const filter = {
      ...getTransactionsByReferenceQuery(),
      ...query,
    };
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const basis = await this.accountingBasisService.resolve(query.basis);

    // Retrieve the accounts transactions of the given reference.
    const transactions = await this.repository.getTransactions(
      query.referenceId,
      filter.referenceType,
      basis,
    );
    // Transactions by reference report.
    const report = new TransactionsByReference(transactions, filter, {
      baseCurrency: tenantMetadata.baseCurrency,
      dateFormat: tenantMetadata.dateFormat,
    });

    return {
      transactions: report.reportData(),
    };
  }
}
