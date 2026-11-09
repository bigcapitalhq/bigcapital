import { Injectable, Logger } from '@nestjs/common';
import { OrgFinancialTotalsMap } from '@/modules/Analytics/Analytics.constants';
import { LedgerAnalyticsSyncService } from '@/modules/Analytics/services/LedgerAnalyticsSync.service';
import { ClickHouseSchemaService } from '@/modules/Analytics/services/ClickHouseSchema.service';
import { aggregateFinancialTotals } from '@/modules/Analytics/services/LedgerAnalyticsAggregation';

const FALLBACK_QUERY_TIMEOUT = 3000;

/**
 * Computes the total assets and liabilities of the given organizations,
 * from the ClickHouse analytics store with a per-organization fallback
 * to the tenant databases.
 */
@Injectable()
export class WorkspacesFinancialsService {
  private readonly logger = new Logger('WorkspacesFinancials');

  constructor(
    private readonly ledgerAnalyticsSync: LedgerAnalyticsSyncService,
    private readonly schemaService: ClickHouseSchemaService,
  ) {}

  /**
   * Retrieves the financial totals of the given organizations.
   * Organizations that are missing from the map have no computable totals
   * (e.g. the tenant database is not built yet).
   * @param {string[]} organizationIds
   * @returns {Promise<OrgFinancialTotalsMap>}
   */
  public async getTotals(
    organizationIds: string[],
  ): Promise<OrgFinancialTotalsMap> {
    const totals: OrgFinancialTotalsMap = new Map();
    if (organizationIds.length === 0) return totals;

    const remainingIds = [...organizationIds];

    if (this.schemaService.isEnabled()) {
      try {
        const clickhouseTotals =
          await this.ledgerAnalyticsSync.getFinancialTotals(organizationIds);

        clickhouseTotals.forEach((totalsOfOrg, organizationId) => {
          totals.set(organizationId, totalsOfOrg);
        });

        // Keep the organizations that are missing from the ClickHouse
        // (not synced yet or no transactions at all) for the fallback.
        organizationIds.forEach((organizationId) => {
          if (clickhouseTotals.has(organizationId)) {
            const index = remainingIds.indexOf(organizationId);
            if (index !== -1) remainingIds.splice(index, 1);
          }
        });
      } catch (error) {
        this.logger.warn(
          `Failed to compute the workspaces financial totals from ClickHouse: ${error.message}`,
        );
      }
    }

    // Fallback to the tenant databases fan-out for the remaining organizations.
    await Promise.all(
      remainingIds.map(async (organizationId) => {
        try {
          const rows = await Promise.race([
            this.ledgerAnalyticsSync.fetchTenantBalanceRows(organizationId),
            new Promise<never>((_, reject) => {
              const timer = setTimeout(
                () => reject(new Error('Timeout')),
                FALLBACK_QUERY_TIMEOUT,
              );
              // Don't keep the process alive because of the timeout timer.
              timer.unref?.();
            }),
          ]);
          const orgTotals = aggregateFinancialTotals(rows).get(
            organizationId,
          ) ?? {
            totalAssets: 0,
            totalLiabilities: 0,
          };
          totals.set(organizationId, orgTotals);
        } catch (error) {
          this.logger.warn(
            `Failed to compute the financial totals of org ${organizationId}: ${error.message}`,
          );
        }
      }),
    );

    return totals;
  }
}
