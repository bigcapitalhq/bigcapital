// @ts-nocheck
import { Formik } from 'formik';
import * as R from 'ramda';
import { castArray } from 'lodash';
import { useEstimateMailDialogBoot } from './EstimateMailDialogBoot';
import { transformToForm } from '@/utils';
import { DialogsName } from '@/constants/dialogs';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { useSendSaleEstimateMail } from '@/hooks/query';
import { EstimateMailDialogFormContent } from './EstimateMailDialogFormContent';

const initialFormValues = {
  from: [],
  to: [],
  subject: '',
  body: '',
  attachEstimate: true,
};

interface EstimateMailFormValues {
  from: string[];
  to: string[];
  subject: string;
  body: string;
  attachEstimate: boolean;
}

function EstimateMailDialogFormRoot({
  // #withDialogClose
  closeDialog,
}) {
  const { mutateAsync: sendEstimateMail } = useSendSaleEstimateMail();
  const { mailOptions, saleEstimateId } = useEstimateMailDialogBoot();

  const initialValues = {
    ...initialFormValues,
    ...transformToForm(mailOptions, initialFormValues),
    from: mailOptions.from ? castArray(mailOptions.from) : [],
    to: mailOptions.to ? castArray(mailOptions.to) : [],
  };
  // Handle the form submitting.
  const handleSubmit = (values: EstimateMailFormValues, { setSubmitting }) => {
    setSubmitting(true);
    sendEstimateMail([saleEstimateId, values])
      .then(() => {
        setSubmitting(false);
      })
      .catch((error) => {
        setSubmitting(false);
      });
  };

  const handleClose = () => {
    closeDialog(DialogsName.EstimateMail);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <EstimateMailDialogFormContent onClose={handleClose} />
    </Formik>
  );
}

export const EstimateMailDialogForm = R.compose(withDialogActions)(
  EstimateMailDialogFormRoot,
);
