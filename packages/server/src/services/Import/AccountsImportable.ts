import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { IAccountCreateDTO } from '@/interfaces';
import { AccountsApplication } from '../Accounts/AccountsApplication';
import { CreateAccount } from '../Accounts/CreateAccount';

@Service()
export class AccountsImportable {
  @Inject()
  private createAccountService: CreateAccount;

  /**
   *
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
   *
   * @param data
   * @returns
   */
  public transform(data) {
    return { ...data };
  }

  /**
   *
   * @param data
   * @returns
   */
  public preTransform(data) {
    return { ...data };
  }
}
