import * as Yup from 'yup';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  active: Yup.boolean(),
  name: Yup.string()
    .required()
    .min(0)
    .max(DATATYPES_LENGTH.STRING)
    .label(formatMessage({ id: 'item_name_' })),
  type: Yup.string()
    .trim()
    .required()
    .min(0)
    .max(DATATYPES_LENGTH.STRING)
    .label(formatMessage({ id: 'item_type_' })),
  sku: Yup.string().trim().min(0).max(DATATYPES_LENGTH.STRING),
  cost_price: Yup.number().when(['purchasable'], {
    is: true,
    then: Yup.number()
      .required()
      .label(formatMessage({ id: 'cost_price_' })),
    otherwise: Yup.number().nullable(true),
  }),
  sell_price: Yup.number().when(['sellable'], {
    is: true,
    then: Yup.number()
      .required()
      .label(formatMessage({ id: 'sell_price_' })),
    otherwise: Yup.number().nullable(true),
  }),
  cost_account_id: Yup.number()
    .when(['purchasable'], {
      is: true,
      then: Yup.number().required(),
      otherwise: Yup.number().nullable(true),
    })
    .label(formatMessage({ id: 'cost_account_id' })),
  sell_account_id: Yup.number()
    .when(['sellable'], {
      is: true,
      then: Yup.number().required(),
      otherwise: Yup.number().nullable(),
    })
    .label(formatMessage({ id: 'sell_account_id' })),
  inventory_account_id: Yup.number()
    .when(['type'], {
      is: (value) => value === 'inventory',
      then: Yup.number().required(),
      otherwise: Yup.number().nullable(),
    })
    .label(formatMessage({ id: 'inventory_account' })),
  category_id: Yup.number().positive().nullable(),
  stock: Yup.string() || Yup.boolean(),
  sellable: Yup.boolean().required(),
  purchasable: Yup.boolean().required(),
});


export const transformItemFormData = (item, defaultValue) => {
  return {
    ...item,
    sellable: item?.sellable ? Boolean(item.sellable) : defaultValue.sellable,
    purchasable: item?.purchasable ? Boolean(item.purchasable) : defaultValue.purchasable,
  };
}

export const CreateItemFormSchema = Schema;
export const EditItemFormSchema = Schema;
