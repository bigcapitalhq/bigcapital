import * as Yup from 'yup';

export const ContactsPreferencesSchema = Yup.object().shape({
  customerAutoIncrement: Yup.boolean(),
  customerNumberPrefix: Yup.string().optional(),
  customerNextNumber: Yup.string().when('customerAutoIncrement', {
    is: true,
    then: Yup.string()
      .trim()
      .required('Next customer number is required.')
      .matches(/^\d+$/, 'Next customer number must be numeric.'),
  }),

  vendorAutoIncrement: Yup.boolean(),
  vendorNumberPrefix: Yup.string().optional(),
  vendorNextNumber: Yup.string().when('vendorAutoIncrement', {
    is: true,
    then: Yup.string()
      .trim()
      .required('Next vendor number is required.')
      .matches(/^\d+$/, 'Next vendor number must be numeric.'),
  }),
});
