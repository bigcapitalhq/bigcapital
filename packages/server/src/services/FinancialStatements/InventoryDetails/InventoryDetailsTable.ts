import * as R from 'ramda';
import {
  IInventoryDetailsItem,
  IInventoryDetailsItemTransaction,
  IInventoryDetailsClosing,
  ITableColumn,
  ITableRow,
  IInventoryDetailsNode,
  IInventoryDetailsOpening,
} from '@/interfaces';
import { mapValuesDeep } from 'utils/deepdash';
import { tableRowMapper } from 'utils';

enum IROW_TYPE {
  ITEM = 'ITEM',
  TRANSACTION = 'TRANSACTION',
  CLOSING_ENTRY = 'CLOSING_ENTRY',
  OPENING_ENTRY = 'OPENING_ENTRY',
}

const MAP_CONFIG = { childrenPath: 'children', pathFormat: 'array' };

export default class InventoryDetailsTable {
  i18n: any;
  report: any;

  /**
   * Constructor method.
   * @param {ICashFlowStatement} reportStatement - Report statement.
   */
  constructor(reportStatement, i18n) {
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
    transaction: IInventoryDetailsItemTransaction
  ) => {
    const columns = [
      { key: 'date', accessor: 'date.formattedDate' },
      { key: 'transaction_type', accessor: 'transactionType' },
      { key: 'transaction_id', accessor: 'transactionNumber' },
      {
        key: 'quantity_movement',
        accessor: 'quantityMovement.formattedNumber',
      },
      { key: 'rate', accessor: 'rate.formattedNumber' },
      { key: 'total', accessor: 'total.formattedNumber' },
      { key: 'value', accessor: 'valueMovement.formattedNumber' },
      { key: 'profit_margin', accessor: 'profitMargin.formattedNumber' },
      { key: 'running_quantity', accessor: 'runningQuantity.formattedNumber' },
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
    transaction: IInventoryDetailsOpening
  ): ITableRow => {
    const columns = [
      { key: 'date', accessor: 'date.formattedDate' },
      { key: 'closing', value: this.i18n.__('Opening balance') },
      { key: 'empty' },
      { key: 'quantity', accessor: 'quantity.formattedNumber' },
      { key: 'empty' },
      { key: 'empty' },
      { key: 'value', accessor: 'value.formattedNumber' },
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
    transaction: IInventoryDetailsClosing
  ): ITableRow => {
    const columns = [
      { key: 'date', accessor: 'date.formattedDate' },
      { key: 'closing', value: this.i18n.__('Closing balance') },
      { key: 'empty' },
      { key: 'quantity', accessor: 'quantity.formattedNumber' },
      { key: 'empty' },
      { key: 'empty' },
      { key: 'value', accessor: 'value.formattedNumber' },
      { key: 'profitMargin', accessor: 'profitMargin.formattedNumber' },
    ];

    return tableRowMapper(transaction, columns, {
      rowTypes: [IROW_TYPE.CLOSING_ENTRY],
    });
  };

  /**
   * Determines the ginve inventory details node type.
   * @param {string} type
   * @param {IInventoryDetailsNode} node
   * @returns {boolean}
   */
  private isNodeTypeEquals = (
    type: string,
    node: IInventoryDetailsNode
  ): boolean => {
    return node.nodeType === type;
  };

  /**
   * Mappes the given item or transactions node to table rows.
   * @param {IInventoryDetailsNode} node -
   * @return {ITableRow}
   */
  private itemMapper = (node: IInventoryDetailsNode): ITableRow => {
    return R.compose(
      R.when(
        R.curry(this.isNodeTypeEquals)('OPENING_ENTRY'),
        this.openingNodeMapper
      ),
      R.when(
        R.curry(this.isNodeTypeEquals)('CLOSING_ENTRY'),
        this.closingNodeMapper
      ),
      R.when(R.curry(this.isNodeTypeEquals)('item'), this.itemNodeMapper),
      R.when(
        R.curry(this.isNodeTypeEquals)('transaction'),
        this.itemTransactionNodeMapper
      )
    )(node);
  };

  /**
   * Mappes the items nodes to table rows.
   * @param {IInventoryDetailsItem[]} items
   * @returns {ITableRow[]}
   */
  private itemsMapper = (items: IInventoryDetailsItem[]): ITableRow[] => {
    return mapValuesDeep(items, this.itemMapper, MAP_CONFIG);
  };

  /**
   * Retrieve the table rows of the inventory item details.
   * @returns {ITableRow[]}
   */
  public tableData = (): ITableRow[] => {
    return this.itemsMapper(this.report.data);
  };

  /**
   * Retrieve the table columns of inventory details report.
   * @returns {ITableColumn[]}
   */
  public tableColumns = (): ITableColumn[] => {
    return [
      { key: 'date', label: this.i18n.__('Date') },
      { key: 'transaction_type', label: this.i18n.__('Transaction type') },
      { key: 'transaction_id', label: this.i18n.__('Transaction #') },
      { key: 'quantity', label: this.i18n.__('Quantity') },
      { key: 'rate', label: this.i18n.__('Rate') },
      { key: 'total', label: this.i18n.__('Total') },
      { key: 'value', label: this.i18n.__('Value') },
      { key: 'profit_margin', label: this.i18n.__('Profit Margin') },
      { key: 'running_quantity', label: this.i18n.__('Running quantity') },
      { key: 'running_value', label: this.i18n.__('Running Value') },
    ];
  };
}
