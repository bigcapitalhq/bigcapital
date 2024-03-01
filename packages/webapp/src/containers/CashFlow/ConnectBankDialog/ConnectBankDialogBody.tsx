// @ts-nocheck
import * as R from 'ramda';
import { Form, Formik, FormikHelpers } from 'formik';
import classNames from 'classnames';
import { ConnectBankDialogContent } from './ConnectBankDialogContent';
import { useGetPlaidLinkToken } from '@/hooks/query';
import { useSetBankingPlaidToken } from '@/hooks/state/banking';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { CLASSES } from '@/constants';
import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';
import { DialogsName } from '@/constants/dialogs';

const initialValues: ConnectBankDialogForm = {
  serviceProvider: 'plaid',
};

interface ConnectBankDialogForm {
  serviceProvider: 'plaid';
}

function ConnectBankDialogBodyRoot({
  // #withDialogActions
  closeDialog,
}) {
  const { mutateAsync: getPlaidLinkToken } = useGetPlaidLinkToken();
  const setPlaidId = useSetBankingPlaidToken();

  // Handles the form submitting.
  const handleSubmit = (
    values: ConnectBankDialogForm,
    { setSubmitting }: FormikHelpers<ConnectBankDialogForm>,
  ) => {
    setSubmitting(true);
    getPlaidLinkToken()
      .then((res) => {
        setSubmitting(false);
        closeDialog(DialogsName.ConnectBankCreditCard);
        setPlaidId(res.data.link_token);
      })
      .catch(() => {
        setSubmitting(false);
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  return (
    <div className={classNames(CLASSES.DIALOG_BODY)}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form>
          <ConnectBankDialogContent />
        </Form>
      </Formik>
    </div>
  );
}

export default R.compose(withDialogActions)(ConnectBankDialogBodyRoot);
