import { formatMessage } from 'services/intl';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

export const transitionItemTypeKeyToLabel = (itemTypeKey) => {
  const table = {
    service: formatMessage({ id: 'service' }),
    inventory: formatMessage({ id: 'inventory' }),
    'non-inventory': formatMessage({ id: 'non_inventory' }),
  };
  return typeof table[itemTypeKey] === 'string' ? table[itemTypeKey] : '';
};

// handle delete errors.
export const handleDeleteErrors = (errors) => {
  if (
    errors.find((error) => error.type === 'ITEM_HAS_ASSOCIATED_TRANSACTINS')
  ) {
    AppToaster.show({
      message: formatMessage({
        id: 'the_item_has_associated_transactions',
      }),
      intent: Intent.DANGER,
    });
  }

  if (
    errors.find(
      (error) => error.type === 'ITEM_HAS_ASSOCIATED_INVENTORY_ADJUSTMENT',
    )
  ) {
    AppToaster.show({
      message: formatMessage({
        id:
          'you_could_not_delete_item_that_has_associated_inventory_adjustments_transacions',
      }),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find(
      (error) => error.type === 'TYPE_CANNOT_CHANGE_WITH_ITEM_HAS_TRANSACTIONS',
    )
  ) {
    AppToaster.show({
      message: formatMessage({
        id:
          'cannot_change_item_type_to_inventory_with_item_has_associated_transactions',
      }),
      intent: Intent.DANGER,
    });
  }
};
