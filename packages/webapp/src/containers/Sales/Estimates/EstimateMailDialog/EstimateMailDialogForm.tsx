// @ts-nocheck
import { Formik } from 'formik';
import * as R from 'ramda';
import { Intent } from '@blueprintjs/core';
import { useEstimateMailDialogBoot } from './EstimateMailDialogBoot';
import { DialogsName } from '@/constants/dialogs';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { useSendSaleEstimateMail } from '@/hooks/query';
import { EstimateMailDialogFormContent } from './EstimateMailDialogFormContent';
import {
  initialMailNotificationValues,
  MailNotificationFormValues,
  transformMailFormToInitialValues,
  transformMailFormToRequest,
} from '@/containers/SendMailNotification/utils';
import { AppToaster } from '@/components';

const initialFormValues = {
  ...initialMailNotificationValues,
  attachEstimate: true,
};

interface EstimateMailFormValues extends MailNotificationFormValues {
  attachEstimate: boolean;
}

function EstimateMailDialogFormRoot({
  onFormSubmit,
  onCancelClick,

  // #withDialogClose
  closeDialog,
}) {
  const { mutateAsync: sendEstimateMail } = useSendSaleEstimateMail();
  const { mailOptions, saleEstimateId, redirectToEstimatesList } =
    useEstimateMailDialogBoot();

  const initialValues = transformMailFormToInitialValues(
    mailOptions,
    initialFormValues,
  );
  // Handle the form submitting.
  const handleSubmit = (values: EstimateMailFormValues, { setSubmitting }) => {
    const reqValues = transformMailFormToRequest(values);

    setSubmitting(true);
    sendEstimateMail([saleEstimateId, reqValues])
      .then(() => {
        AppToaster.show({
          message: 'The mail notification has been sent successfully.',
          intent: Intent.SUCCESS,
        });
        closeDialog(DialogsName.EstimateMail);
        setSubmitting(false);
        onFormSubmit && onFormSubmit();
      })
      .catch(() => {
        setSubmitting(false);
        closeDialog(DialogsName.EstimateMail);
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
        onCancelClick && onCancelClick();
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
