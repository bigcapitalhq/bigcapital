import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

export const transitionItemTypeKeyToLabel = (itemTypeKey) => {
  const table = {
    service: intl.get('service'),
    inventory: intl.get('inventory'),
    'non-inventory': intl.get('non_inventory'),
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
      message: intl.get('you_could_not_delete_item_that_has_associated_inventory_adjustments_transacions'),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find(
      (error) => error.type === 'TYPE_CANNOT_CHANGE_WITH_ITEM_HAS_TRANSACTIONS',
    )
  ) {
    AppToaster.show({
      message: intl.get('cannot_change_item_type_to_inventory_with_item_has_associated_transactions'),
      intent: Intent.DANGER,
    });
  }
};
