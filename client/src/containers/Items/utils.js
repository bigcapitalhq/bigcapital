import { formatMessage } from "services/intl";

export const transitionItemTypeKeyToLabel = (itemTypeKey) => {
  const table = {
    'service': formatMessage({ id: 'service' }),
    'inventory': formatMessage({ id: 'inventory' }),
    'non-inventory': formatMessage({ id: 'non_inventory' }),
  };
  return typeof table[itemTypeKey] === 'string' ? table[itemTypeKey] : '';
};