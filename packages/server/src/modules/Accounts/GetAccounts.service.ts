import { Inject, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { IAccountsFilter, IAccountsStructureType } from './Accounts.types';
import { DynamicListService } from '../DynamicListing/DynamicList.service';
import { AccountTransformer } from './Account.transformer';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { Account } from './models/Account.model';
import { AccountRepository } from './repositories/Account.repository';
import { IFilterMeta } from '@/interfaces/Model';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { GetAccountsQueryDto } from './dtos/GetAccountsQuery.dto';

@Injectable()
export class GetAccountsService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformerService: TransformerInjectable,
    private readonly accountRepository: AccountRepository,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) { }

  /**
   * Retrieve accounts datatable list.
   * @param {IAccountsFilter} accountsFilter
   * @returns {Promise<{ accounts: IAccountResponse[]; filterMeta: IFilterMeta }>}
   */
  public async getAccountsList(
    filterDto: Partial<GetAccountsQueryDto>,
  ): Promise<{ accounts: Account[]; filterMeta: IFilterMeta }> {
    const parsedFilterDto = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      onlyInactive: false,
      structure: IAccountsStructureType.Tree,
      ...filterDto,
    };
    // Parses the stringified filter roles.
    const filter = this.parseListFilterDTO(parsedFilterDto);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      this.accountModel(),
      filter,
    );
    // Retrieve accounts model based on the given query.
    const accounts = await this.accountModel()
      .query()
      .onBuild((builder) => {
        dynamicList.buildQuery()(builder);
        builder.modify('inactiveMode', filterDto.onlyInactive);
      });
    const accountsGraph = await this.accountRepository.getDependencyGraph();

    // Retrieves the transformed accounts collection.
    const transformedAccounts = await this.transformerService.transform(
      accounts,
      new AccountTransformer(),
      { accountsGraph, structure: parsedFilterDto.structure },
    );
    return {
      accounts: transformedAccounts,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }

  /**
   * Parsees accounts list filter DTO.
   * @param filterDTO
   * @returns
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }
}
