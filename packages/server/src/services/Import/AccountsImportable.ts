import { IAccountCreateDTO } from '@/interfaces';
import { AccountsApplication } from '../Accounts/AccountsApplication';
import { AccountDTOSchema } from '../Accounts/CreateAccountDTOSchema';
import { Inject, Service } from 'typedi';
import { Knex } from 'knex';

@Service()
export class AccountsImportable {
  @Inject()
  private accountsApp: AccountsApplication;

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
    return this.accountsApp.createAccount(tenantId, createAccountDTO, trx);
  }

  /**
   *
   * @param data
   * @returns
   */
  public transform(data) {
    return {
      ...data,
    };
  }

  mapAccountType(accountType: string) {
    return 'Cash';
  }
}
