import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

export const TrackingCategoryFormSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('tracking_categories.field.name')),
  description: Yup.string()
    .trim()
    .max(500)
    .nullable()
    .label(intl.get('tracking_categories.field.description')),
  options: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string()
          .trim()
          .required()
          .max(DATATYPES_LENGTH.STRING)
          .label(intl.get('tracking_categories.field.option_name')),
        active: Yup.boolean(),
      }),
    )
    .test(
      'unique-option-names',
      intl.get('tracking_categories.error.option_name_exists'),
      (options) => {
        const names = (options ?? [])
          .map((option) => option?.name?.trim().toLowerCase())
          .filter(Boolean);

        return new Set(names).size === names.length;
      },
    ),
});
