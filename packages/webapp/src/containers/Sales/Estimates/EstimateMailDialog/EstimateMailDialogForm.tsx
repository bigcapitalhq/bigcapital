import { Formik } from 'formik';
import { useEstimateMailDialogBoot } from './EstimateMailDialogBoot';
import { transformToForm } from '@/utils';
import { SendMailNotificationForm } from '@/containers/SendMailNotification';
import { castArray } from 'lodash';

const initialFormValues = {
  from: [],
  to: [],
  subject: '',
  message: '',
};

export function EstimateMailDialogForm() {
  const { mailOptions } = useEstimateMailDialogBoot();

  const initialValues = {
    ...initialFormValues,
    ...transformToForm(mailOptions, initialFormValues),
    from: mailOptions.from ? castArray(mailOptions.from) : [],
    to: mailOptions.to ? castArray(mailOptions.to) : [],
  };

  const handleSubmit = () => {};

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <SendMailNotificationForm />
    </Formik>
  );
}
