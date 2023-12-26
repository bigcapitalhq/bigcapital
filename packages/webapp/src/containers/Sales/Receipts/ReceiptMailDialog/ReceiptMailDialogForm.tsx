import { Formik } from 'formik';
import { castArray } from 'lodash';
import { SendMailNotificationForm } from '@/containers/SendMailNotification';
import { useReceiptMailDialogBoot } from './ReceiptMailDialogBoot';
import { transformToForm } from '@/utils';

const initialFormValues = {
  from: [],
  to: [],
  subject: '',
  message: '',
};
export function ReceiptMailDialogForm() {
  const { mailOptions } = useReceiptMailDialogBoot();

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
