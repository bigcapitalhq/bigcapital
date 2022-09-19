// @ts-nocheck
import * as Yup from 'yup';

export const getFilterDropdownSchema = () =>
  Yup.object().shape({
    conditions: Yup.array().of(
      Yup.object().shape({
        fieldKey: Yup.string(),
        value: Yup.string().nullable(),
        condition: Yup.string().nullable(),
        comparator: Yup.string().nullable(),
      }),
    ),
  });
