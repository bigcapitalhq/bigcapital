// @ts-nocheck
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';
import { defaultTo } from 'lodash';


const Schema = Yup.object().shape({
  format_money: Yup.string(),
  show_zero: Yup.boolean(),
  show_in_red: Yup.boolean(),
  divide_on_1000: Yup.boolean(),
  negative_format: Yup.string(),
  precision: Yup.string(),
});

export const CreateNumberFormateSchema = Schema;
