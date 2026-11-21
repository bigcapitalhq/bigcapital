import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';
import { isBlank } from '@/utils';

const getSchema = () =>
  Yup.object().shape({
    customerId: Yup.string().label(intl.get('customer_name_')).required(),
    creditNoteDate: Yup.date().required().label(intl.get('invoice_date_')),
    creditNoteNumber: Yup.string()
      .max(DATATYPES_LENGTH.STRING)
      .label(intl.get('invoice_no_')),
    referenceNo: Yup.string().min(1).max(DATATYPES_LENGTH.STRING),
    note: Yup.string()
      .trim()
      .min(1)
      .max(DATATYPES_LENGTH.TEXT)
      .label(intl.get('note')),
    open: Yup.boolean(),
    termsConditions: Yup.string()
      .trim()
      .min(1)
      .max(DATATYPES_LENGTH.TEXT)
      .label(intl.get('note')),
    branchId: Yup.string(),
    warehouseId: Yup.string(),
    exchangeRate: Yup.number(),
    entries: Yup.array().of(
      Yup.object().shape({
        quantity: Yup.number()
          .nullable()
          .max(DATATYPES_LENGTH.INT_10)
          .when(['rate'], {
            is: (rate) => rate,
            then: Yup.number().required(),
          }),
        rate: Yup.number().nullable().max(DATATYPES_LENGTH.INT_10),
        itemId: Yup.number().nullable(),
        sellAccountId: Yup.number()
          .nullable()
          .test(
            'account-required-without-item',
            intl.get('item_entries.account_required_without_item'),
            function (value) {
              const { itemId, quantity, rate } = this.parent;
              if (isBlank(itemId) && !isBlank(quantity) && !isBlank(rate)) {
                return !isBlank(value);
              }
              return true;
            },
          ),
        discount: Yup.number().nullable().min(0).max(100),
        description: Yup.string()
          .nullable()
          .max(DATATYPES_LENGTH.TEXT)
          .test(
            'item-or-description-required',
            intl.get('item_entries.item_or_description_required'),
            function (value) {
              const { itemId, quantity, rate } = this.parent;
              if (isBlank(itemId) && !isBlank(quantity) && !isBlank(rate)) {
                return typeof value === 'string' && value.trim().length > 0;
              }
              return true;
            },
          ),
      }),
    ),
  });

export const CreateCreditNoteFormSchema = getSchema;
export const EditCreditNoteFormSchema = getSchema;
