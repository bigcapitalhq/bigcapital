import * as Yup from 'yup';
import intl from 'react-intl-universal';

const Schema = Yup.object().shape({
  branch_name: Yup.string().required().label(intl.get('branch_name')),
  branch_address_1: Yup.string().trim(),
  branch_address_2: Yup.string().trim(),
  branch_address_city: Yup.string().trim(),
  branch_address_country: Yup.string().trim(),
  website: Yup.string().url().nullable(),
  phone_number: Yup.number(),
  email: Yup.string().email().nullable(),
});

export const CreateBranchFormSchema = Schema;
