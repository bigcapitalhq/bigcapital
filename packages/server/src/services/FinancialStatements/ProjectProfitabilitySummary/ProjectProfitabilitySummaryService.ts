import { Inject, Service } from 'typedi';
import {
  IProjectProfitabilitySummaryMeta,
  IProjectProfitabilitySummaryPOJO,
  ProjectProfitabilitySummaryQuery,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Tenant } from '@/system/models';
import { ProfitProfitabilitySummary } from './ProjectProfitabilitySummary';
import { ProjectProfitabilitySummaryRespository } from './ProjectProfitabilitySummaryRepository';

@Service()
export class ProjectProfitabilitySummaryService {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the project profitability summary report.
   * @param {number} tenantId
   * @param {ProjectProfitabilitySummaryQuery} query
   * @returns {Promise<IProjectProfitabilitySummaryPOJO>}
   */
  public projectProfitabilitySummary = async (
    tenantId: number,
    query: ProjectProfitabilitySummaryQuery
  ): Promise<IProjectProfitabilitySummaryPOJO> => {
    const models = this.tenancy.models(tenantId);

    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    // Initialize the report repository.
    const projectProfitabilityRepo = new ProjectProfitabilitySummaryRespository(
      models,
      query
    );
    await projectProfitabilityRepo.asyncInitialize();

    const projectProfitabilityInstance = new ProfitProfitabilitySummary(
      projectProfitabilityRepo,
      tenant.metadata.baseCurrency
    );
    const projectProfitData = projectProfitabilityInstance.getReportData();

    return {
      data: projectProfitData,
      query,
      meta: this.reportMetadata(tenantId),
    };
  };

  /**
   * Retrieve the balance sheet meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  private reportMetadata(tenantId: number): IProjectProfitabilitySummaryMeta {
    const settings = this.tenancy.settings(tenantId);

    const organizationName = settings.get({
      group: 'organization',
      key: 'name',
    });
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    return {
      organizationName,
      baseCurrency,
    };
  }
}
