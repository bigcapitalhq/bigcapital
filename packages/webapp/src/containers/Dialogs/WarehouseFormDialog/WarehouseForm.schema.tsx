// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  name: Yup.string().required().label(intl.get('warehouse_name')),
  code: Yup.string().trim().min(0).max(DATATYPES_LENGTH.STRING),
  address: Yup.string().trim(),
  warehouse_address_2: Yup.string().trim(),
  city: Yup.string().trim(),
  country: Yup.string().trim(),
  phone_number: Yup.number(),
  website: Yup.string().url().nullable(),
  email: Yup.string().email().nullable(),
});

export const CreateWarehouseFormSchema = Schema;
