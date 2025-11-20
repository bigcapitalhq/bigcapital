import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteSaleInvoice } from './commands/DeleteSaleInvoice.service';

@Injectable()
export class ValidateBulkDeleteSaleInvoicesService {
  constructor(
    private readonly deleteSaleInvoiceService: DeleteSaleInvoice,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) { }

  public async validateBulkDeleteSaleInvoices(saleInvoiceIds: number[]): Promise<{
    deletableCount: number;
    nonDeletableCount: number;
    deletableIds: number[];
    nonDeletableIds: number[];
  }> {
    const trx = await this.tenantKnex().transaction({
      isolationLevel: 'read uncommitted',
    });

    try {
      const deletableIds: number[] = [];
      const nonDeletableIds: number[] = [];

      for (const saleInvoiceId of saleInvoiceIds) {
        try {
          await this.deleteSaleInvoiceService.deleteSaleInvoice(
            saleInvoiceId,
            trx,
          );
          deletableIds.push(saleInvoiceId);
        } catch (error) {
          nonDeletableIds.push(saleInvoiceId);
        }
      }

      await trx.rollback();

      return {
        deletableCount: deletableIds.length,
        nonDeletableCount: nonDeletableIds.length,
        deletableIds,
        nonDeletableIds,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

