import * as R from 'ramda';
import {
  IInventoryDetailsItem,
  IInventoryDetailsItemTransaction,
  IInventoryDetailsClosing,
  IInventoryDetailsNode,
  IInventoryDetailsOpening,
  IInvetoryItemDetailDOO,
} from './InventoryItemDetails.types';
import { I18nService } from 'nestjs-i18n';
import { IInventoryDetailsData } from './InventoryItemDetails.types';
import { tableRowMapper } from '../../utils/Table.utils';
import {
  IColumnMapperMeta,
  ITableColumn,
  ITableRow,
} from '../../types/Table.types';
import { mapValuesDeep } from '@/utils/deepdash';
import { INVENTORY_ITEM_DETAILS_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

enum IROW_TYPE {
  ITEM = 'ITEM',
  TRANSACTION = 'TRANSACTION',
  CLOSING_ENTRY = 'CLOSING_ENTRY',
  OPENING_ENTRY = 'OPENING_ENTRY',
}

const MAP_CONFIG = { childrenPath: 'children', pathFormat: 'array' };

export class InventoryItemDetailsTable {
  i18n: I18nService;
  report: any;

  /**
   * Constructor method.
   * @param {ICashFlowStatement} report - Report statement.
   */
  constructor(reportStatement: IInvetoryItemDetailDOO, i18n: I18nService) {
    this.report = reportStatement;
    this.i18n = i18n;
  }

  /**
   * Mappes the item node to table rows.
   * @param {IInventoryDetailsItem} item
   * @returns {ITableRow}
   */
  private itemNodeMapper = (item: IInventoryDetailsItem) => {
    const columns = [{ key: 'item_name', accessor: 'name' }];

    return tableRowMapper(item, columns, {
      rowTypes: [IROW_TYPE.ITEM],
    });
  };

  /**
   * Mappes the item inventory transaction to table row.
   * @param {IInventoryDetailsItemTransaction} transaction
   * @returns {ITableRow}
   */
  private itemTransactionNodeMapper = (
    transaction: IInventoryDetailsItemTransaction,
  ) => {
    const columns = [
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.DATE,
        accessor: 'date.formattedDate',
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.TRANSACTION_TYPE,
        accessor: 'transactionType',
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.TRANSACTION_ID,
        accessor: 'transactionNumber',
      },
      {
        key: 'quantity_movement',
        accessor: 'quantityMovement.formattedNumber',
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.RATE,
        accessor: 'rate.formattedNumber',
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.TOTAL,
        accessor: 'total.formattedNumber',
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.VALUE,
        accessor: 'valueMovement.formattedNumber',
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.PROFIT_MARGIN,
        accessor: 'profitMargin.formattedNumber',
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.RUNNING_QUANTITY,
        accessor: 'runningQuantity.formattedNumber',
      },
      {
        key: 'running_valuation',
        accessor: 'runningValuation.formattedNumber',
      },
    ];
    return tableRowMapper(transaction, columns, {
      rowTypes: [IROW_TYPE.TRANSACTION],
    });
  };

  /**
   * Opening balance transaction mapper to table row.
   * @param {IInventoryDetailsOpening} transaction
   * @returns {ITableRow}
   */
  private openingNodeMapper = (
    transaction: IInventoryDetailsOpening,
  ): ITableRow => {
    const columns: Array<IColumnMapperMeta> = [
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.DATE,
        accessor: 'date.formattedDate',
      },
      {
        key: 'closing',
        value: this.i18n.t('inventory_item_details.opening_balance'),
      },
      { key: 'empty', value: '' },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.QUANTITY,
        accessor: 'quantity.formattedNumber',
      },
      { key: 'empty', value: '' },
      { key: 'empty', value: '' },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.VALUE,
        accessor: 'value.formattedNumber',
      },
    ];
    return tableRowMapper(transaction, columns, {
      rowTypes: [IROW_TYPE.OPENING_ENTRY],
    });
  };

  /**
   * Closing balance transaction mapper to table raw.
   * @param {IInventoryDetailsClosing} transaction
   * @returns {ITableRow}
   */
  private closingNodeMapper = (
    transaction: IInventoryDetailsClosing,
  ): ITableRow => {
    const columns: Array<IColumnMapperMeta> = [
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.DATE,
        accessor: 'date.formattedDate',
      },
      {
        key: 'closing',
        value: this.i18n.t('inventory_item_details.closing_balance'),
      },
      { key: 'empty', value: '' },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.QUANTITY,
        accessor: 'quantity.formattedNumber',
      },
      { key: 'empty', value: '' },
      { key: 'empty', value: '' },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.VALUE,
        accessor: 'value.formattedNumber',
      },
      { key: 'profitMargin', accessor: 'profitMargin.formattedNumber' },
    ];
    return tableRowMapper(transaction, columns, {
      rowTypes: [IROW_TYPE.CLOSING_ENTRY],
    });
  };

  /**
   * Detarmines the ginve inventory details node type.
   * @param {string} type
   * @param {IInventoryDetailsNode} node
   * @returns {boolean}
   */
  private isNodeTypeEquals = (
    type: string,
    node: IInventoryDetailsNode,
  ): boolean => {
    return node.nodeType === type;
  };

  /**
   * Mappes the given item or transactions node to table rows.
   * @param {IInventoryDetailsNode} node -
   * @return {ITableRow}
   */
  private itemMapper = (node: IInventoryDetailsNode): ITableRow => {
    console.log(node, 'node');

    // @ts-ignore
    return R.compose(
      R.when(
        // @ts-ignore
        R.curry(this.isNodeTypeEquals)('OPENING_ENTRY'),
        this.openingNodeMapper,
      ),
      R.when(
        // @ts-ignore
        R.curry(this.isNodeTypeEquals)('CLOSING_ENTRY'),
        this.closingNodeMapper,
      ),
      R.when(R.curry(this.isNodeTypeEquals)('item'), this.itemNodeMapper),
      R.when(
        R.curry(this.isNodeTypeEquals)('transaction'),
        this.itemTransactionNodeMapper,
      ),
    )(node);
  };

  /**
   * Mappes the items nodes to table rows.
   * @param {IInventoryDetailsItem[]} items
   * @returns {ITableRow[]}
   */
  private itemsMapper = (items: IInventoryDetailsItem[]): ITableRow[] => {
    // @ts-ignore
    return mapValuesDeep(items, this.itemMapper, MAP_CONFIG);
  };

  /**
   * Retrieve the table rows of the inventory item details.
   * @returns {ITableRow[]}
   */
  public tableRows = (): ITableRow[] => {
    return this.itemsMapper(this.report.data);
  };

  /**
   * Retrieve the table columns of inventory details report.
   * @returns {ITableColumn[]}
   */
  public tableColumns = (): ITableColumn[] => {
    return [
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.DATE,
        label: this.i18n.t('inventory_item_details.date'),
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.TRANSACTION_TYPE,
        label: this.i18n.t('inventory_item_details.transaction_type'),
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.TRANSACTION_ID,
        label: this.i18n.t('inventory_item_details.transaction_number'),
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.QUANTITY,
        label: this.i18n.t('inventory_item_details.quantity'),
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.RATE,
        label: this.i18n.t('inventory_item_details.rate'),
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.TOTAL,
        label: this.i18n.t('inventory_item_details.total'),
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.VALUE,
        label: this.i18n.t('inventory_item_details.value'),
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.PROFIT_MARGIN,
        label: this.i18n.t('inventory_item_details.profit_margin'),
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.RUNNING_QUANTITY,
        label: this.i18n.t('inventory_item_details.running_quantity'),
      },
      {
        key: INVENTORY_ITEM_DETAILS_COLUMN_KEYS.RUNNING_VALUE,
        label: this.i18n.t('inventory_item_details.running_value'),
      },
    ];
  };
}
