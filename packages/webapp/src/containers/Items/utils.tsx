// @ts-nocheck
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { defaultTo, includes } from 'lodash';
import { useHistory } from 'react-router-dom';
import { AppToaster } from '@/components';
import {
  transformToForm,
  transformTableStateToQuery,
  defaultFastFieldShouldUpdate,
} from '@/utils';
import { useSettingsSelector } from '@/hooks/state';
import { transformItemFormData } from './ItemForm.schema';
import { useWatch } from '@/hooks/utils';

const defaultInitialValues = {
  active: 1,
  name: '',
  type: 'service',
  code: '',
  cost_price: '',
  sell_price: '',
  cost_account_id: '',
  sell_account_id: '',
  inventory_account_id: '',
  category_id: '',
  sellable: 1,
  purchasable: true,
  sell_description: '',
  purchase_description: '',
};

/**
 * Initial values in create and edit mode.
 */
export const useItemFormInitialValues = (item, initialValues) => {
  const { items: itemsSettings } = useSettingsSelector();

  return useMemo(
    () => ({
      ...defaultInitialValues,
      cost_account_id: defaultTo(itemsSettings?.preferredCostAccount, ''),
      sell_account_id: defaultTo(itemsSettings?.preferredSellAccount, ''),
      inventory_account_id: defaultTo(
        itemsSettings?.preferredInventoryAccount,
        '',
      ),
      /**
       * We only care about the fields in the form. Previously unfilled optional
       * values such as `notes` come back from the API as null, so remove those
       * as well.
       */
      ...transformToForm(
        transformItemFormData(item, defaultInitialValues),
        defaultInitialValues,
      ),
      ...initialValues,
    }),
    [item, itemsSettings, initialValues],
  );
};

export const transitionItemTypeKeyToLabel = (itemTypeKey) => {
  const table = {
    service: intl.get('service'),
    inventory: intl.get('inventory'),
  };
  return typeof table[itemTypeKey] === 'string' ? table[itemTypeKey] : '';
};

// handle delete errors.
export const handleDeleteErrors = (errors) => {
  if (
    errors.find((error) => error.type === 'ITEM_HAS_ASSOCIATED_TRANSACTINS')
  ) {
    AppToaster.show({
      message: intl.get('the_item_has_associated_transactions'),
      intent: Intent.DANGER,
    });
  }

  if (
    errors.find(
      (error) => error.type === 'ITEM_HAS_ASSOCIATED_INVENTORY_ADJUSTMENT',
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
      (error) => error.type === 'TYPE_CANNOT_CHANGE_WITH_ITEM_HAS_TRANSACTIONS',
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
    errors.find((error) => error.type === 'ITEM_HAS_ASSOCIATED_TRANSACTIONS')
  ) {
    AppToaster.show({
      message: intl.get('item.error.you_could_not_delete_item_has_associated'),
      intent: Intent.DANGER,
    });
  }
};

/**
 * Determines accounts fast field should update.
 */
export const accountsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Determines categories fast field should update.
 */
export const categoriesFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.categories !== oldProps.categories ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Sell price fast field should update.
 */
export const sellPriceFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.sellable !== oldProps.sellable ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Sell account fast field should update.
 */
export const sellAccountFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    newProps.sellable !== oldProps.sellable ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Sell description fast field should update.
 */
export const sellDescriptionFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.sellable !== oldProps.sellable ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export const costAccountFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.accounts !== oldProps.accounts ||
    newProps.purchasable !== oldProps.purchasable ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export const costPriceFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.purchasable !== oldProps.purchasable ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export const purchaseDescFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.purchasable !== oldProps.purchasable ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export function transformItemsTableState(tableState) {
  return {
    ...transformTableStateToQuery(tableState),
    inactive_mode: tableState.inactiveMode,
  };
}

/**
 * Transform API errors.
 */
export const transformSubmitRequestErrors = (error) => {
  const {
    response: {
      data: { errors },
    },
  } = error;
  const fields = {};

  if (errors.find((e) => e.type === 'ITEM.NAME.ALREADY.EXISTS')) {
    fields.name = intl.get('the_name_used_before');
  }
  if (errors.find((e) => e.type === 'INVENTORY_ACCOUNT_CANNOT_MODIFIED')) {
    AppToaster.show({
      message: intl.get('cannot_change_item_inventory_account'),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find(
      (e) => e.type === 'TYPE_CANNOT_CHANGE_WITH_ITEM_HAS_TRANSACTIONS',
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

/**
 * Watches and handles item response not found error.
 * @param {*} itemQuery
 */
export function useWatchItemError(itemQuery) {
  const { error, isError } = itemQuery;

  // History context.
  const history = useHistory();

  useWatch(() => {
    if (isError && includes([400, 404], error.response.status)) {
      AppToaster.show({
        message: 'The given item not found.',
        intent: Intent.DANGER,
      });
      history.push('/items');
    }
  }, isError);
}
