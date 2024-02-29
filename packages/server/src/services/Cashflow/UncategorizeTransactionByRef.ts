import { Service } from 'typedi';
import { UncategorizeCashflowTransaction } from './UncategorizeCashflowTransaction';

@Service()
export class UncategorizeTransactionByRef {
  private uncategorizeTransactionService: UncategorizeCashflowTransaction;

  public uncategorize(tenantId: number, refId: number, refType: string) {}
}
