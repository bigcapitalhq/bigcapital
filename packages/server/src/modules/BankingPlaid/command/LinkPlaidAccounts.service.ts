import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import {
  AccountBase as PlaidAccount,
  AccountType as PlaidAccountType,
  PlaidApi,
} from 'plaid';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { PLAID_CLIENT } from '@/modules/Plaid/Plaid.module';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { PlaidItemAccountLinkDto } from '../dtos/PlaidItemAccountLink.dto';

export const ERRORS = {
  PLAID_ACCOUNT_LINKED_TWICE: 'PLAID_ACCOUNT_LINKED_TWICE',
  ACCOUNT_LINKED_TWICE: 'ACCOUNT_LINKED_TWICE',
  PLAID_ACCOUNT_NOT_FOUND: 'PLAID_ACCOUNT_NOT_FOUND',
  ACCOUNT_NOT_FOUND: 'ACCOUNT_NOT_FOUND',
  ACCOUNT_ALREADY_LINKED: 'ACCOUNT_ALREADY_LINKED',
  ACCOUNT_TYPE_MISMATCH: 'ACCOUNT_TYPE_MISMATCH',
  ACCOUNT_CURRENCY_MISMATCH: 'ACCOUNT_CURRENCY_MISMATCH',
};

export interface PlaidAccountLink {
  account: Account;
  plaidAccount: PlaidAccount;
}

/**
 * Retrieves the account types an existing account may have to receive the
 * feeds of the given Plaid account type, mirroring the type a new account
 * would get on sync.
 * @param {PlaidAccountType} plaidAccountType
 * @returns {string[]}
 */
const getLinkableAccountTypes = (plaidAccountType: PlaidAccountType) => {
  if (plaidAccountType === PlaidAccountType.Credit) {
    return [ACCOUNT_TYPE.CREDIT_CARD];
  }
  return [ACCOUNT_TYPE.BANK, ACCOUNT_TYPE.CASH];
};

@Injectable()
export class LinkPlaidAccountsService {
  constructor(
    private readonly uow: UnitOfWork,

    @Inject(PLAID_CLIENT)
    private readonly plaidClient: PlaidApi,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) {}

  /**
   * Validates the requested links against the Plaid item accounts and the
   * existing accounts, and resolves each link to both sides.
   * @param {string} plaidAccessToken - Plaid access token of the new item.
   * @param {PlaidItemAccountLinkDto[]} links - Requested links.
   * @returns {Promise<PlaidAccountLink[]>}
   */
  public async validateLinks(
    plaidAccessToken: string,
    links: PlaidItemAccountLinkDto[] = [],
  ): Promise<PlaidAccountLink[]> {
    if (links.length === 0) {
      return [];
    }
    this.validateLinksUniqueness(links);

    const {
      data: { accounts: plaidAccounts },
    } = await this.plaidClient.accountsGet({ access_token: plaidAccessToken });

    const accounts = await this.accountModel()
      .query()
      .whereIn(
        'id',
        links.map((link) => link.accountId),
      );

    return links.map((link) => {
      const plaidAccount = plaidAccounts.find(
        (a) => a.account_id === link.plaidAccountId,
      );
      if (!plaidAccount) {
        throw new ServiceError(
          ERRORS.PLAID_ACCOUNT_NOT_FOUND,
          'The selected bank account is not part of this bank connection.',
        );
      }
      const account = accounts.find((a) => a.id === link.accountId);

      if (!account) {
        throw new ServiceError(
          ERRORS.ACCOUNT_NOT_FOUND,
          'The account to link is not found.',
        );
      }
      if (account.plaidAccountId) {
        throw new ServiceError(
          ERRORS.ACCOUNT_ALREADY_LINKED,
          `The account "${account.name}" is already connected to a bank account.`,
        );
      }
      if (
        !getLinkableAccountTypes(plaidAccount.type).includes(
          account.accountType,
        )
      ) {
        throw new ServiceError(
          ERRORS.ACCOUNT_TYPE_MISMATCH,
          `The account "${account.name}" type does not match the bank account "${plaidAccount.name}".`,
        );
      }
      const plaidCurrencyCode = plaidAccount.balances.iso_currency_code;

      if (plaidCurrencyCode && account.currencyCode !== plaidCurrencyCode) {
        throw new ServiceError(
          ERRORS.ACCOUNT_CURRENCY_MISMATCH,
          `The account "${account.name}" currency does not match the bank account currency ${plaidCurrencyCode}.`,
        );
      }
      return { account, plaidAccount };
    });
  }

  /**
   * Links the existing accounts to their Plaid accounts, so the item sync
   * feeds them instead of creating new accounts.
   * @param {string} plaidItemId - Plaid item id.
   * @param {PlaidAccountLink[]} links - Validated links.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public async linkAccounts(
    plaidItemId: string,
    links: PlaidAccountLink[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      for (const { account, plaidAccount } of links) {
        await this.accountModel().query(trx).findById(account.id).patch({
          plaidAccountId: plaidAccount.account_id,
          plaidItemId,
          accountMask: plaidAccount.mask,
          bankBalance: plaidAccount.balances.current,
          isSyncingOwner: true,
        });
      }
    }, trx);
  }

  /**
   * Validates each Plaid account and each existing account is linked once.
   * @param {PlaidItemAccountLinkDto[]} links
   */
  private validateLinksUniqueness(links: PlaidItemAccountLinkDto[]) {
    const plaidAccountsIds = links.map((link) => link.plaidAccountId);
    const accountsIds = links.map((link) => link.accountId);

    if (new Set(plaidAccountsIds).size !== plaidAccountsIds.length) {
      throw new ServiceError(
        ERRORS.PLAID_ACCOUNT_LINKED_TWICE,
        'A bank account can be linked to one account only.',
      );
    }
    if (new Set(accountsIds).size !== accountsIds.length) {
      throw new ServiceError(
        ERRORS.ACCOUNT_LINKED_TWICE,
        'An account can be linked to one bank account only.',
      );
    }
  }
}
