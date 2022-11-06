// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  name: Yup.string()
    .required()
    .max(DATATYPES_LENGTH.STRING)
    .label(intl.get('category_name_')),
  description: Yup.string().trim().max(DATATYPES_LENGTH.TEXT).nullable(),
});

export const CreateItemCategoryFormSchema = Schema;
export const EditItemCategoryFormSchema = Schema;
