import * as Yup from 'yup';
import { DATATYPES_LENGTH } from 'common/dataTypes';

export const getFilterDropdownSchema = () => Yup.object().shape({
  conditions: Yup.array().of(
    Yup.object().shape({
      fieldKey: Yup.string().max(DATATYPES_LENGTH.TEXT),
      value: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
      condition: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
      comparator: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
    }),
  ),
});
