import * as bluebird from 'bluebird';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { Account } from '@/modules/Accounts/models/Account.model';
import { CreateAccountService } from '@/modules/Accounts/CreateAccount.service';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SimpleFinClient } from '../SimpleFinClient.service';
import { SimpleFinItem } from '../models/SimpleFinItem';
import { ERRORS } from '../constants';
import { transformSimpleFinAccountToCreateAccount } from '../utils';
import { SimpleFinLinkAccountsDto } from '../dtos/SimpleFin.dto';
import { ISimpleFinItemLinkedEventPayload } from '../types/BankingSimpleFin.types';

@Injectable()
export class LinkSimpleFinAccountsService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
    private readonly tenancyContext: TenancyContext,
    private readonly simplefinClient: SimpleFinClient,
    private readonly createAccountService: CreateAccountService,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(SimpleFinItem.name)
    private readonly simplefinItemModel: TenantModelProxy<typeof SimpleFinItem>,
  ) {}

  /**
   * Creates bank/credit card accounts for the selected SimpleFIN accounts of
   * the given item, then triggers the initial transactions sync.
   * @param {SimpleFinLinkAccountsDto} linkDTO
   * @returns {Promise<number[]>} The created account ids.
   */
  public async linkAccounts(
    linkDTO: SimpleFinLinkAccountsDto,
  ): Promise<number[]> {
    const simplefinItem = await this.simplefinItemModel()
      .query()
      .findOne({ simplefinItemId: linkDTO.itemId });

    if (!simplefinItem) {
      throw new ServiceError(ERRORS.SIMPLEFIN_ITEM_NOT_FOUND);
    }
    const tenant = await this.tenancyContext.getTenant(true);
    const baseCurrency = tenant.metadata.baseCurrency;

    // Validate none of the requested SimpleFIN accounts is already linked.
    const requestedIds = linkDTO.accounts.map((a) => a.accountId);
    const alreadyLinked = await this.accountModel()
      .query()
      .where({ simplefinItemId: linkDTO.itemId })
      .whereIn('simplefinAccountId', requestedIds);

    if (alreadyLinked.length > 0) {
      throw new ServiceError(
        ERRORS.SIMPLEFIN_ACCOUNT_ALREADY_LINKED,
        'One or more of the given SimpleFIN accounts are already linked.',
        { accountIds: alreadyLinked.map((a) => a.simplefinAccountId) },
      );
    }
    // Retrieve the latest account metadata/balances from SimpleFIN.
    const accountSet = await this.simplefinClient.getAccounts(
      simplefinItem.accessUrl,
      { balancesOnly: true, accountIds: requestedIds },
    );
    const accountsById = new Map(accountSet.accounts.map((a) => [a.id, a]));

    const missing = requestedIds.filter((id) => !accountsById.has(id));
    if (missing.length > 0) {
      throw new ServiceError(
        ERRORS.SIMPLEFIN_ACCOUNT_NOT_FOUND,
        'One or more of the given SimpleFIN accounts were not found.',
        { accountIds: missing },
      );
    }
    const createdIds = await this.uow.withTransaction(
      async (trx: Knex.Transaction) => {
        const ids = await bluebird.mapSeries(
          linkDTO.accounts,
          async ({ accountId, accountType }) => {
            const createDTO = transformSimpleFinAccountToCreateAccount(
              simplefinItem.simplefinItemId,
              accountType,
              baseCurrency,
              accountsById.get(accountId),
            );
            const account = await this.createAccountService.createAccount(
              createDTO,
              trx,
              { ignoreUniqueName: true, ignoreAccountCode: true },
            );
            return account.id;
          },
        );
        return ids;
      },
    );
    // Triggers `onSimpleFinItemLinked` event (queues the initial sync).
    await this.eventEmitter.emitAsync(events.simplefin.onItemLinked, {
      simplefinItemId: simplefinItem.simplefinItemId,
      connectionName: simplefinItem.connectionName,
      accountIds: createdIds,
    } as ISimpleFinItemLinkedEventPayload);

    return createdIds;
  }
}
