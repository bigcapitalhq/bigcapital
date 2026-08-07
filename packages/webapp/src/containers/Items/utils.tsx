import { Intent } from '@blueprintjs/core';
import { defaultTo, includes } from 'lodash';
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { transformItemFormData } from './ItemForm.schema';
import type { ItemFormValues } from './types';
import type { Item } from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import { useSettingsItems } from '@/hooks/query';
import { useWatch } from '@/hooks/utils';
import {
  transformToForm,
  transformTableStateToQuery,
  defaultFastFieldShouldUpdate,
} from '@/utils';

type ItemError = { type: string };

/**
 * Error types for item operations.
 */
export const ItemErrorType = {
  ItemNameExists: 'ITEM_NAME_EXISTS',
  InventoryAccountCannotModified: 'INVENTORY_ACCOUNT_CANNOT_MODIFIED',
  TypeCannotChangeWithItemHasTransactions:
    'TYPE_CANNOT_CHANGE_WITH_ITEM_HAS_TRANSACTIONS',
  ItemHasAssociatedTransactions: 'ITEM_HAS_ASSOCIATED_TRANSACTINS',
  ItemHasAssociatedInventoryAdjustment:
    'ITEM_HAS_ASSOCIATED_INVENTORY_ADJUSTMENT',
  ItemHasAssociatedTransactionsPlural: 'ITEM_HAS_ASSOCIATED_TRANSACTIONS',
} as const;

const defaultInitialValues: ItemFormValues = {
  active: true,
  name: '',
  type: 'service',
  code: '',
  costPrice: '',
  sellPrice: '',
  costAccountId: '',
  sellAccountId: '',
  sellTaxRateId: '',
  inventoryAccountId: '',
  categoryId: '',
  sellable: true,
  purchasable: true,
  sellDescription: '',
  purchaseDescription: '',
  purchaseTaxRateId: '',
};

type ItemsSettings = {
  preferredCostAccount?: number | string | null;
  preferredSellAccount?: number | string | null;
  preferredInventoryAccount?: number | string | null;
};

/**
 * Initial values in create and edit mode.
 */
export const useItemFormInitialValues = (
  item: Item | undefined,
  initialValues?: Partial<ItemFormValues>,
): ItemFormValues => {
  const { data: itemsSettings } = useSettingsItems() as {
    data?: ItemsSettings;
  };

  return useMemo(
    () => ({
      ...defaultInitialValues,
      costAccountId: defaultTo(itemsSettings?.preferredCostAccount, ''),
      sellAccountId: defaultTo(itemsSettings?.preferredSellAccount, ''),
      inventoryAccountId: defaultTo(
        itemsSettings?.preferredInventoryAccount,
        '',
      ),
      /**
       * We only care about the fields in the form. Previously unfilled optional
       * values such as `notes` come back from the API as null, so remove those
       * as well.
       */
      ...(transformToForm(
        transformItemFormData(item, defaultInitialValues),
        defaultInitialValues,
      ) as Partial<ItemFormValues>),
      ...(initialValues ?? {}),
    }),
    [item, itemsSettings, initialValues],
  );
};

export const transitionItemTypeKeyToLabel = (itemTypeKey: string): string => {
  const table: Record<string, string> = {
    service: intl.get('service'),
    inventory: intl.get('inventory'),
  };
  return typeof table[itemTypeKey] === 'string' ? table[itemTypeKey] : '';
};

// handle delete errors.
export const handleDeleteErrors = (errors: ItemError[]): void => {
  if (
    errors.find(
      (error) => error.type === ItemErrorType.ItemHasAssociatedTransactions,
    )
  ) {
    AppToaster.show({
      message: intl.get('the_item_has_associated_transactions'),
      intent: Intent.DANGER,
    });
  }

  if (
    errors.find(
      (error) =>
        error.type === ItemErrorType.ItemHasAssociatedInventoryAdjustment,
    )
  ) {
    AppToaster.show({
      message: intl.get(
        'you_could_not_delete_item_that_has_associated_inventory_adjustments_transacions',
      ),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find(
      (error) =>
        error.type === ItemErrorType.TypeCannotChangeWithItemHasTransactions,
    )
  ) {
    AppToaster.show({
      message: intl.get(
        'cannot_change_item_type_to_inventory_with_item_has_associated_transactions',
      ),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find(
      (error) =>
        error.type === ItemErrorType.ItemHasAssociatedTransactionsPlural,
    )
  ) {
    AppToaster.show({
      message: intl.get('item.error.you_could_not_delete_item_has_associated'),
      intent: Intent.DANGER,
    });
  }
};

type FastFieldShouldUpdateProps = Record<string, unknown>;

/**
 * Detarmines accounts fast field should update.
 */
export const accountsFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmines categories fast field should update.
 */
export const categoriesFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.categories !== oldProps.categories ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Sell price fast field should update.
 */
export const sellPriceFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.sellable !== oldProps.sellable ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Sell account fast field should update.
 */
export const sellAccountFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.items !== oldProps.items ||
    newProps.sellable !== oldProps.sellable ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Sell description fast field should update.
 */
export const sellDescriptionFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.sellable !== oldProps.sellable ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export const costAccountFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.accounts !== oldProps.accounts ||
    newProps.purchasable !== oldProps.purchasable ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export const costPriceFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.purchasable !== oldProps.purchasable ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export const purchaseDescFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.purchasable !== oldProps.purchasable ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export const taxRateFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.shouldUpdateDeps !== oldProps.shouldUpdateDeps ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export function transformItemsTableState(
  tableState: Record<string, unknown> & { inactiveMode?: boolean },
) {
  return {
    ...transformTableStateToQuery(tableState),
    inactive_mode: tableState.inactiveMode,
  };
}

/**
 * Transform API errors.
 */
export const transformSubmitRequestErrors = (error: {
  data: { errors: ItemError[] };
}): Record<string, string> => {
  const {
    data: { errors },
  } = error;
  const fields: Record<string, string> = {};

  if (errors.find((e) => e.type === ItemErrorType.ItemNameExists)) {
    fields.name = intl.get('the_name_used_before');
  }
  if (
    errors.find((e) => e.type === ItemErrorType.InventoryAccountCannotModified)
  ) {
    AppToaster.show({
      message: intl.get('cannot_change_item_inventory_account'),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find(
      (e) => e.type === ItemErrorType.TypeCannotChangeWithItemHasTransactions,
    )
  ) {
    AppToaster.show({
      message: intl.get(
        'item.error.type_cannot_change_with_item_has_transactions',
      ),
      intent: Intent.DANGER,
    });
  }
  return fields;
};

type ItemQuery = {
  // react-query error is typed as `unknown` or `Error`; we inspect for axios shape at runtime.
  error: unknown;
  isError: boolean;
};

/**
 * Watches and handles item response not found error.
 */
export function useWatchItemError(itemQuery: ItemQuery): void {
  const { error, isError } = itemQuery;

  // History context.
  const history = useHistory();

  useWatch(() => {
    const status = (error as { response?: { status?: number } } | null)
      ?.response?.status;
    if (isError && includes([400, 404], status)) {
      AppToaster.show({
        message: 'The given item not found.',
        intent: Intent.DANGER,
      });
      history.push('/items');
    }
  }, isError);
}
