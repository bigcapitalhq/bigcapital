import * as Yup from 'yup';

const getSchema = () =>
  Yup.object().shape({
    name: Yup.string().required().label('Name'),
    code: Yup.string().required().label('Code'),
    active: Yup.boolean().optional().label('Active'),
    description: Yup.string().optional().label('Description'),
    rate: Yup.number()
      .min(0, 'Enter a rate percentage of at least 0%')
      .max(100, 'Enter a rate percentage of at most 100%')
      .required()
      .label('Rate'),
    isCompound: Yup.boolean().optional().label('Is Compound'),
    isNonRecoverable: Yup.boolean().optional().label('Is Non Recoverable'),
    confirmEdit: Yup.boolean().optional(),
  });

export const CreateTaxRateFormSchema = getSchema;
export const EditTaxRateFormSchema = getSchema;
