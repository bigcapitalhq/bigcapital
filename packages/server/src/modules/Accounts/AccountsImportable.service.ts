import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { Importable } from '../Import/Importable';
import { AccountsSampleData } from './AccountsImportable.SampleData';
import { CreateAccountDTO } from './CreateAccount.dto';
import { CreateAccountService } from './CreateAccount.service';

@Injectable()
export class AccountsImportable extends Importable {
  constructor(private readonly createAccountService: CreateAccountService) {
    super();
  }

  /**
   * Importing to account service.
   * @param {CreateAccountDTO} createAccountDTO - Create account dto.
   * @returns
   */
  public importable(
    createAccountDTO: CreateAccountDTO,
    trx?: Knex.Transaction,
  ) {
    return this.createAccountService.createAccount(
      createAccountDTO,
      trx,
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
    return AccountsSampleData;
  }
}
