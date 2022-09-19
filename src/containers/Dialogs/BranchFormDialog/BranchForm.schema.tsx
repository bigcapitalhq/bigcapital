// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  name: Yup.string().required().label(intl.get('branch_name')),
  code: Yup.string().trim().min(0).max(DATATYPES_LENGTH.STRING),
  address: Yup.string().trim(),
  city: Yup.string().trim(),
  country: Yup.string().trim(),
  website: Yup.string().url().nullable(),
  phone_number: Yup.number(),
  email: Yup.string().email().nullable(),
});

export const CreateBranchFormSchema = Schema;
