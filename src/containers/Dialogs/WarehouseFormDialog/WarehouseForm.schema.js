import * as Yup from 'yup';
import intl from 'react-intl-universal';

const Schema = Yup.object().shape({
  warehouse_name: Yup.string().required().label(intl.get('warehouse_name')),
  warehouse_address_1: Yup.string().trim(),
  warehouse_address_2: Yup.string().trim(),
  warehouse_address_city: Yup.string().trim(),
  warehouse_address_country: Yup.string().trim(),
  phone_number: Yup.number(),
});

export const CreateWarehouseFormSchema = Schema;
