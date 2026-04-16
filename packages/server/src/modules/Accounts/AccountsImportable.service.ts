import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Importable } from '../Import/Importable';
import { AccountsSampleData } from './AccountsImportable.SampleData';
import { CreateAccountDTO } from './CreateAccount.dto';
import { CreateAccountService } from './CreateAccount.service';
import { ImportableService } from '../Import/decorators/Import.decorator';
import { Account } from './models/Account.model';
import { ImportableContext } from '../Import/interfaces';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
@ImportableService({ name: Account.name })
export class AccountsImportable extends Importable {
  // Tracks deferred parent relationships: { createdAccountId, parentName }
  private deferredParents: Array<{
    accountId: number;
    parentValue: string;
  }> = [];

  constructor(
    private readonly createAccountService: CreateAccountService,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) {
    super();
  }

  /**
   * Strips parentAccountId from the DTO and defers the relationship.
   */
  public transform(
    createDTO: Record<string, any>,
    context: ImportableContext,
  ) {
    // Store the raw parent value before it gets resolved to an ID.
    // The parent value is in _parentAccountRaw (set below) or parentAccountId.
    return createDTO;
  }

  /**
   * Creates the account without a parent, then queues the parent
   * relationship for deferred resolution after all accounts exist.
   */
  public async importable(
    createAccountDTO: CreateAccountDTO,
    trx?: Knex.Transaction,
  ) {
    // Extract and clear parentAccountId — we'll set it in afterImport.
    const parentAccountId = createAccountDTO.parentAccountId;
    const dtoWithoutParent = { ...createAccountDTO, parentAccountId: undefined };

    const account = await this.createAccountService.createAccount(
      dtoWithoutParent as CreateAccountDTO,
      trx,
    );

    // If there was a parent reference, defer it for post-processing.
    if (parentAccountId) {
      this.deferredParents.push({
        accountId: account.id,
        parentValue: String(parentAccountId),
      });
    }
    return account;
  }

  /**
   * After all accounts are created, resolve parent-child relationships.
   * Looks up parents by ID (the relation resolver may have already resolved
   * the name/code to an ID), or by name/code for newly created accounts.
   */
  public async afterImport(trx?: Knex.Transaction): Promise<void> {
    for (const deferred of this.deferredParents) {
      try {
        let parentId: number | null = null;

        // Try as numeric ID first (already resolved by the relation parser).
        const numericId = Number(deferred.parentValue);
        if (!isNaN(numericId) && numericId > 0) {
          const parent = await this.accountModel()
            .query(trx)
            .findById(numericId);
          if (parent) {
            parentId = parent.id;
          }
        }

        // If not found by ID, try by name or code (for newly created accounts).
        if (!parentId) {
          const parent = await this.accountModel()
            .query(trx)
            .where(function () {
              this.orWhereRaw('LOWER(name) = LOWER(?)', [
                deferred.parentValue,
              ]);
              this.orWhereRaw('LOWER(code) = LOWER(?)', [
                deferred.parentValue,
              ]);
            })
            .first();
          if (parent) {
            parentId = parent.id;
          }
        }

        if (parentId) {
          await this.accountModel()
            .query(trx)
            .findById(deferred.accountId)
            .patch({ parentAccountId: parentId });
        }
      } catch {
        // Skip failed parent resolutions silently — the account was still created.
      }
    }
    // Reset for next import run.
    this.deferredParents = [];
  }

  public get concurrency() {
    return 1;
  }

  public sampleData(): any[] {
    return AccountsSampleData;
  }
}
