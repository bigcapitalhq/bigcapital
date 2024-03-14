import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { IAccountCreateDTO } from '@/interfaces';
import { CreateAccount } from './CreateAccount';
import { Importable } from '../Import/Importable';

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
  public importable(
    tenantId: number,
    createAccountDTO: IAccountCreateDTO,
    trx?: Knex.Transaction
  ) {
    return this.createAccountService.createAccount(
      tenantId,
      createAccountDTO,
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
}
