import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SimpleFinClient } from '../SimpleFinClient.service';
import { SimpleFinItem } from '../models/SimpleFinItem';
import { SystemSimpleFinItem } from '../models/SystemSimpleFinItem';
import { ERRORS } from '../constants';
import {
  decodeSimpleFinSetupToken,
  transformSimpleFinAccountToClaimed,
} from '../utils';
import { SimpleFinClaimTokenResult } from '../types/BankingSimpleFin.types';

@Injectable()
export class ClaimSimpleFinTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tenancyContext: TenancyContext,
    private readonly simplefinClient: SimpleFinClient,

    @Inject(SimpleFinItem.name)
    private readonly simplefinItemModel: TenantModelProxy<typeof SimpleFinItem>,

    @Inject(SystemSimpleFinItem.name)
    private readonly systemSimpleFinItemModel: typeof SystemSimpleFinItem,
  ) {}

  /**
   * Claims the given SimpleFIN setup token, stores the resulting access URL
   * as a new SimpleFIN item and returns the accounts available behind it so
   * the user can choose which ones to link.
   * @param {string} setupToken - The SimpleFIN setup token.
   * @returns {Promise<SimpleFinClaimTokenResult>}
   */
  public async claimToken(
    setupToken: string,
  ): Promise<SimpleFinClaimTokenResult> {
    if (!this.configService.get('simplefin.enabled')) {
      throw new ServiceError(
        ERRORS.SIMPLEFIN_DISABLED,
        'SimpleFIN bank feeds are disabled on this server.',
      );
    }
    const claimUrl = decodeSimpleFinSetupToken(setupToken);

    if (!claimUrl) {
      throw new ServiceError(
        ERRORS.SIMPLEFIN_SETUP_TOKEN_INVALID,
        'The given SimpleFIN setup token is not valid.',
      );
    }
    const tenant = await this.tenancyContext.getTenant();

    // Exchanges the one-time setup token for the long-lived access URL.
    const accessUrl = await this.simplefinClient.claimAccessUrl(claimUrl);

    // Fetch the accounts (balances only) to present them to the user.
    const accountSet = await this.simplefinClient.getAccounts(accessUrl, {
      balancesOnly: true,
    });
    const accounts = accountSet.accounts.map(
      transformSimpleFinAccountToClaimed,
    );
    const connectionName = accounts.find(
      (a) => a.connectionName,
    )?.connectionName;

    const simplefinItemId = randomUUID();

    // Store the item on the tenant scope.
    await this.simplefinItemModel()
      .query()
      .insert({
        tenantId: tenant.id,
        simplefinItemId,
        accessUrl,
        connectionName: connectionName || null,
      });
    // Store the item reference on the system scope so background jobs can
    // resolve the tenant of each item.
    await this.systemSimpleFinItemModel.query().insert({
      tenantId: tenant.id,
      simplefinItemId,
    });
    return { itemId: simplefinItemId, accounts };
  }
}
