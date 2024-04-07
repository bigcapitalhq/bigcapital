import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { IExpenseCreateDTO } from '@/interfaces';
import { Importable } from '../Import/Importable';
import { CreateExpense } from './CRUD/CreateExpense';
import { ExpensesSampleData } from './constants';

@Service()
export class ExpensesImportable extends Importable {
  @Inject()
  private createExpenseService: CreateExpense;

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(
    tenantId: number,
    createAccountDTO: IExpenseCreateDTO,
    trx?: Knex.Transaction
  ) {
    return this.createExpenseService.newExpense(
      tenantId,
      createAccountDTO,
      {},
      trx
    );
  }

  /**
   * Concurrrency controlling of the importing process.
   * @returns {number}
   */
  public get concurrency() {
    return 1;
  }

  /**
   * Retrieves the sample data that used to download accounts sample sheet.
   */
  public sampleData(): any[] {
    return ExpensesSampleData;
  }
}
