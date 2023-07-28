import {
  ISaleInvoice,
  ISaleInvoiceCreateDTO,
  ISystemUser,
  ITenantUser,
} from '@/interfaces';
import { Inject, Service } from 'typedi';
import { CreateSaleInvoice } from './CreateSaleInvoice';
import { DeleteSaleInvoice } from './DeleteSaleInvoice';
import { GetSaleInvoice } from './GetSaleInvoice';

@Service()
export class SaleInvoiceApplication {
  @Inject()
  private createSaleInvoiceService: CreateSaleInvoice;

  @Inject()
  private deleteSaleInvoiceService: DeleteSaleInvoice;

  @Inject()
  private getSaleInvoiceService: GetSaleInvoice;

  /**
   * 
   * @param tenantId 
   * @param saleInvoiceDTO 
   * @param authorizedUser 
   * @returns 
   */
  public createSaleInvoice(
    tenantId: number,
    saleInvoiceDTO: ISaleInvoiceCreateDTO,
    authorizedUser: ITenantUser
  ): Promise<ISaleInvoice> {
    return this.createSaleInvoiceService.createSaleInvoice(
      tenantId,
      saleInvoiceDTO,
      authorizedUser
    );
  }

  /**
   * 
   */
  public editSaleInvoice() {}

  /**
   * 
   * @param tenantId 
   * @param saleInvoiceId 
   * @param authorizedUser 
   * @returns 
   */
  public deleteSaleInvoice(
    tenantId: number,
    saleInvoiceId: number,
    authorizedUser: ISystemUser
  ) {
    return this.deleteSaleInvoiceService.deleteSaleInvoice(
      tenantId,
      saleInvoiceId,
      authorizedUser
    );
  }

  public getSaleInvoices() {}
  public getSaleInvoice() {}
}
