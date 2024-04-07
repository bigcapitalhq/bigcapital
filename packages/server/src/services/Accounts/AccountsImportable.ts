import { IAccountCreateDTO } from '@/interfaces';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { Importable } from '../Import/Importable';
import { AccountsSampleData } from './AccountsImportable.SampleData';
import { CreateAccount } from './CreateAccount';

@Service()
export class AccountsImportable extends Importable {
  @Inject()
  private createAccountService: CreateAccount;

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(tenantId: number, createAccountDTO: IAccountCreateDTO, trx?: Knex.Transaction) {
    return this.createAccountService.createAccount(tenantId, createAccountDTO, trx);
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
    return AccountsSampleData;
  }
}
