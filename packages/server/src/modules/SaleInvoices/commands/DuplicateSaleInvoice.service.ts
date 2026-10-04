import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { CreateSaleInvoice } from './CreateSaleInvoice.service';
import {
  DUPLICATE_SALE_INVOICE_DUE_DAYS,
  resolveDuplicateInvoiceNumber,
  transformSaleInvoiceToDuplicateDTO,
} from './DuplicateSaleInvoice.utils';
import { SaleInvoice } from '../models/SaleInvoice';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SettingsStore } from '@/modules/Settings/SettingsStore';
import { SETTINGS_PROVIDER } from '@/modules/Settings/Settings.types';

const SALE_INVOICES_SETTINGS_GROUP = 'sales_invoices';

@Injectable()
export class DuplicateSaleInvoice {
  /**
   * @param {CreateSaleInvoice} createSaleInvoiceService - Create sale invoice service.
   * @param {() => SettingsStore} settingsStore - Settings store.
   * @param {TenantModelProxy<typeof SaleInvoice>} saleInvoiceModel - Sale invoice model.
   */
  constructor(
    private readonly createSaleInvoiceService: CreateSaleInvoice,

    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
  ) {}

  /**
   * Duplicates the given sale invoice as a new draft invoice dated today and
   * due `DUPLICATE_SALE_INVOICE_DUE_DAYS` later, numbered with the next unused
   * invoice number. Goes through the regular create flow, so the duplicate is
   * validated and published exactly like any other new invoice.
   * @param {number} saleInvoiceId - The original sale invoice id.
   * @returns {Promise<SaleInvoice>} The created duplicate.
   */
  public async duplicateSaleInvoice(
    saleInvoiceId: number,
  ): Promise<SaleInvoice> {
    const saleInvoice = await this.saleInvoiceModel()
      .query()
      .findById(saleInvoiceId)
      .withGraphFetched('[entries, paymentMethods]')
      .throwIfNotFound();

    const { invoiceNo } = await this.resolveInvoiceNumber(
      saleInvoice.invoiceNo,
    );
    const today = moment().startOf('day');
    const saleInvoiceDTO = transformSaleInvoiceToDuplicateDTO(saleInvoice, {
      invoiceDate: today.toDate(),
      dueDate: today
        .clone()
        .add(DUPLICATE_SALE_INVOICE_DUE_DAYS, 'days')
        .toDate(),
      invoiceNo,
    });
    return this.createSaleInvoiceService.createSaleInvoice(saleInvoiceDTO);
  }

  /**
   * Resolves the duplicate's invoice number, moving the auto-increment
   * sequence past numbers that are already in use first. The sequence is
   * advanced before the invoice is created because the created subscriber
   * increments `next_number` from whatever value it holds at that point.
   * @param {string} originalInvoiceNo
   * @returns {Promise<{ invoiceNo?: string }>}
   */
  private async resolveInvoiceNumber(
    originalInvoiceNo: string,
  ): Promise<{ invoiceNo?: string }> {
    const settings = await this.settingsStore();
    const group = SALE_INVOICES_SETTINGS_GROUP;

    const { invoiceNo, nextNumber } = await resolveDuplicateInvoiceNumber(
      {
        autoIncrement: Boolean(
          settings.get({ group, key: 'auto_increment' }, false),
        ),
        prefix: String(settings.get({ group, key: 'number_prefix' }, '')),
        nextNumber: String(settings.get({ group, key: 'next_number' }, '')),
      },
      originalInvoiceNo,
      (candidate) => this.isInvoiceNoTaken(candidate),
    );
    if (nextNumber !== undefined) {
      settings.set({ group, key: 'next_number' }, nextNumber);
      await settings.save();
    }
    return { invoiceNo };
  }

  /**
   * Determines whether the given invoice number is already used.
   * @param {string} invoiceNo
   * @returns {Promise<boolean>}
   */
  private async isInvoiceNoTaken(invoiceNo: string): Promise<boolean> {
    const saleInvoice = await this.saleInvoiceModel()
      .query()
      .findOne('invoice_no', invoiceNo);

    return Boolean(saleInvoice);
  }
}
