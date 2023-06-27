import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import {
  IAccountsFilter,
  IAccountResponse,
  IFilterMeta,
  IAccountsStructureType,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { AccountTransformer } from './AccountTransform';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { flatToNestedArray } from '@/utils';

@Service()
export class GetAccounts {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Parses accounts list filter DTO.
   * @param filterDTO
   * @returns
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieve accounts datatable list.
   * @param {number} tenantId
   * @param {IAccountsFilter} accountsFilter
   * @returns {Promise<{ accounts: IAccountResponse[]; filterMeta: IFilterMeta }>}
   */
  public getAccountsList = async (
    tenantId: number,
    filterDTO: IAccountsFilter
  ): Promise<{ accounts: IAccountResponse[]; filterMeta: IFilterMeta }> => {
    const { Account } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    // Parses the stringified filter roles.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      tenantId,
      Account,
      filter
    );
    // Retrieve accounts model based on the given query.
    const accounts = await Account.query().onBuild((builder) => {
      dynamicList.buildQuery()(builder);
      builder.modify('inactiveMode', filter.inactiveMode);
    });

    const accountsGraph = await accountRepository.getDependencyGraph();

    // Retrieves the transformed accounts collection.
    const transformedAccounts = await this.transformer.transform(
      tenantId,
      accounts,
      new AccountTransformer(),
      { accountsGraph, structure: filterDTO.structure }
    );

    return {
      accounts: transformedAccounts,
      filterMeta: dynamicList.getResponseMeta(),
    };
  };
}
