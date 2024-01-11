import { Inject, Service } from "typedi";
import { ICashFlowStatementQuery, ICashFlowStatementTable } from "@/interfaces";
import HasTenancyService from "@/services/Tenancy/TenancyService";
import CashFlowTable from "./CashFlowTable";
import CashFlowStatementService from "./CashFlowService";

@Service()
export class CashflowTableInjectable {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private cashflowSheet: CashFlowStatementService;

  /**
   * Retrieves the cash flow table.
   * @returns {Promise<ICashFlowStatementTable>}
   */
  public async table(
    tenantId: number,
    query: ICashFlowStatementQuery
  ): Promise<ICashFlowStatementTable> {
    const i18n = this.tenancy.i18n(tenantId);

    const cashflowDOO = await this.cashflowSheet.cashFlow(tenantId, query);
    const cashflowTable = new CashFlowTable(cashflowDOO, i18n);

    return {
      table: {
        columns: cashflowTable.tableColumns(),
        rows: cashflowTable.tableRows(),
      },
      query: cashflowDOO.query,
      meta: cashflowDOO.meta,
    };
  }
}
