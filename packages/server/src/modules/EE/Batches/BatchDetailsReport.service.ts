import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import * as moment from 'moment';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { formatNumber } from '@/utils/format-number';
import { GetBatchesService } from './queries/GetBatches.service';
import { BatchDetailsReportQueryDto } from './dtos/BatchDetailsReportQuery.dto';
import { BatchStatus } from './types/Batches.types';
import type {
  ITableColumn,
  ITableRow,
} from '@/modules/FinancialStatements/types/Table.types';

const COLUMN_KEYS = {
  ITEM_NAME: 'item_name',
  BATCH_NUMBER: 'batch_number',
  BATCH_REF: 'batch_ref',
  BATCH_STATUS: 'batch_status',
  MANUFACTURED_DATE: 'manufactured_date',
  EXPIRY_DATE: 'expiry_date',
  QUANTITY_IN: 'quantity_in',
  QUANTITY_OUT: 'quantity_out',
  QUANTITY_ON_HAND: 'quantity_on_hand',
} as const;

@Injectable()
export class BatchDetailsReportService {
  /**
   * @param {GetBatchesService} getBatchesService
   * @param {I18nService} i18n
   * @param {TenancyContext} tenancyContext
   */
  constructor(
    private readonly getBatchesService: GetBatchesService,
    private readonly i18n: I18nService,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Builds the batch details report table.
   */
  public async report(query: BatchDetailsReportQueryDto) {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const dateFormat = tenantMetadata.dateFormat || 'YYYY MMM DD';

    const { results } = await this.getBatchesService.getBatches({
      itemsIds: query.itemsIds,
      status: query.status,
      search: query.search,
      fromDate: query.fromDate,
      toDate: query.toDate,
    });

    const columns: ITableColumn[] = [
      {
        key: COLUMN_KEYS.ITEM_NAME,
        label: this.i18n.t('batch_details.item_name'),
      },
      {
        key: COLUMN_KEYS.BATCH_NUMBER,
        label: this.i18n.t('batch_details.batch_number'),
      },
      {
        key: COLUMN_KEYS.BATCH_REF,
        label: this.i18n.t('batch_details.batch_ref'),
      },
      {
        key: COLUMN_KEYS.BATCH_STATUS,
        label: this.i18n.t('batch_details.batch_status'),
      },
      {
        key: COLUMN_KEYS.MANUFACTURED_DATE,
        label: this.i18n.t('batch_details.manufactured_date'),
      },
      {
        key: COLUMN_KEYS.EXPIRY_DATE,
        label: this.i18n.t('batch_details.expiry_date'),
      },
      {
        key: COLUMN_KEYS.QUANTITY_IN,
        label: this.i18n.t('batch_details.quantity_in'),
      },
      {
        key: COLUMN_KEYS.QUANTITY_OUT,
        label: this.i18n.t('batch_details.quantity_out'),
      },
      {
        key: COLUMN_KEYS.QUANTITY_ON_HAND,
        label: this.i18n.t('batch_details.quantity_on_hand'),
      },
    ];

    const rows: ITableRow[] = results.map((batch) => ({
      id: String(batch.id),
      rowTypes: ['BATCH'],
      cells: [
        { key: COLUMN_KEYS.ITEM_NAME, value: batch.item?.name ?? '' },
        { key: COLUMN_KEYS.BATCH_NUMBER, value: batch.batchNumber },
        { key: COLUMN_KEYS.BATCH_REF, value: batch.batchRef ?? '' },
        {
          key: COLUMN_KEYS.BATCH_STATUS,
          value: this.getStatusLabel(batch.status),
        },
        {
          key: COLUMN_KEYS.MANUFACTURED_DATE,
          value: batch.manufacturedDate
            ? moment(batch.manufacturedDate).format(dateFormat)
            : '',
        },
        {
          key: COLUMN_KEYS.EXPIRY_DATE,
          value: batch.expiryDate
            ? moment(batch.expiryDate).format(dateFormat)
            : '',
        },
        {
          key: COLUMN_KEYS.QUANTITY_IN,
          value: this.formatQuantity(batch.quantityIn),
        },
        {
          key: COLUMN_KEYS.QUANTITY_OUT,
          value: this.formatQuantity(batch.quantityOut),
        },
        {
          key: COLUMN_KEYS.QUANTITY_ON_HAND,
          value: this.formatQuantity(batch.quantityOnHand),
        },
      ],
    }));

    return {
      table: { columns, rows },
      query,
      meta: {
        organizationName: tenantMetadata.name,
        baseCurrency: tenantMetadata.baseCurrency,
        dateFormat,
        isCostComputeRunning: false,
        sheetName: this.i18n.t('batch_details.sheet_name'),
        formattedAsDate: moment().format(dateFormat),
      },
    };
  }

  /**
   * Retrieves the localized label of the given batch status.
   */
  private getStatusLabel(status: BatchStatus): string {
    const labels: Record<BatchStatus, string> = {
      [BatchStatus.Active]: this.i18n.t('batch_details.status_active'),
      [BatchStatus.ExpiringSoon]: this.i18n.t(
        'batch_details.status_expiring_soon',
      ),
      [BatchStatus.Expired]: this.i18n.t('batch_details.status_expired'),
      [BatchStatus.Depleted]: this.i18n.t('batch_details.status_depleted'),
    };
    return labels[status] ?? status;
  }

  /**
   * Formats the given quantity with no currency symbol.
   */
  private formatQuantity(quantity: number): string {
    return formatNumber(quantity, {
      precision: 2,
      excerptZero: false,
      money: false,
    });
  }
}
