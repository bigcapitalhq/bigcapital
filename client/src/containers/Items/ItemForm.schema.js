import * as Yup from 'yup';
import { defaultTo } from 'lodash';
import { formatMessage } from 'services/intl';
import { DATATYPES_LENGTH } from 'common/dataTypes';
import { isBlank } from 'utils';

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
  code: Yup.string().trim().min(0).max(DATATYPES_LENGTH.STRING),
  cost_price: Yup.number()
    .min(0)
    .when(['purchasable'], {
      is: true,
      then: Yup.number()
        .required()
        .label(formatMessage({ id: 'cost_price_' })),
      otherwise: Yup.number().nullable(true),
    }),
  sell_price: Yup.number()
    .min(0)
    .when(['sellable'], {
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
  opening_cost: Yup.number().when(['opening_quantity'], {
    is: (value) => value,
    then: Yup.number()
      .min(0)
      .required()
      .label(formatMessage({ id: 'opening_cost_' })),
    otherwise: Yup.number().nullable(),
  }),
  opening_quantity: Yup.number()
    .min(1)
    .nullable()
    .label(formatMessage({ id: 'opening_quantity_' })),
  opening_date: Yup.date().when(['opening_quantity', 'opening_cost'], {
    is: (quantity, cost) => !isBlank(quantity) && !isBlank(cost),
    then: Yup.date()
      .required()
      .label(formatMessage({ id: 'opening_date_' })),
    otherwise: Yup.date().nullable(),
  }),
});

export const transformItemFormData = (item, defaultValue) => {
  return {
    ...item,
    sellable: !!defaultTo(item?.sellable, defaultValue.sellable),
    purchasable: !!defaultTo(item?.purchasable, defaultValue.purchasable),
    active: !!defaultTo(item?.active, defaultValue.active),
  };
};

export const CreateItemFormSchema = Schema;
export const EditItemFormSchema = Schema;
