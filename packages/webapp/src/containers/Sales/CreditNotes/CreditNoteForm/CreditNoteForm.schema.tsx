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
        itemId: Yup.number()
          .nullable()
          .when(['quantity', 'rate'], {
            is: (quantity, rate) => !isBlank(quantity) && !isBlank(rate),
            then: Yup.number().required(),
          }),
        discount: Yup.number().nullable().min(0).max(100),
        description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
      }),
    ),
  });

export const CreateCreditNoteFormSchema = getSchema;
export const EditCreditNoteFormSchema = getSchema;
