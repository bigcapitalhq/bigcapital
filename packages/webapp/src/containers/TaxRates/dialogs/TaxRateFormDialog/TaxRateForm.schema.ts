// @ts-nocheck
import * as Yup from 'yup';

const getSchema = () =>
  Yup.object().shape({
    name: Yup.string().required().label('Name'),
    code: Yup.string().required().label('Code'),
    active: Yup.boolean().optional().label('Active'),
    describtion: Yup.string().optional().label('Description'),
    rate: Yup.number().required().label('Rate'),
    is_compound: Yup.boolean().optional().label('Is Compound'),
    is_non_recoverable: Yup.boolean().optional().label('Is Non Recoverable'),
  });

export const CreateTaxRateFormSchema = getSchema;
export const EditTaxRateFormSchema = getSchema;
