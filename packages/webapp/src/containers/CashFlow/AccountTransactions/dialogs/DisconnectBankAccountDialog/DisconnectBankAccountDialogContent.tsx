// @ts-nocheck
import * as Yup from 'yup';
import { Button, Intent, Classes } from '@blueprintjs/core';
import * as R from 'ramda';
import { Form, Formik, FormikHelpers } from 'formik';
import { AppToaster, FFormGroup, FInputGroup } from '@/components';
import { useDisconnectBankAccount } from '@/hooks/query/bank-rules';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';

interface DisconnectFormValues {
  label: string;
}

const initialValues = {
  label: '',
};

const Schema = Yup.object().shape({
  label: Yup.string().required().label('Confirmation'),
});

interface DisconnectBankAccountDialogContentProps {
  bankAccountId: number;
}

function DisconnectBankAccountDialogContent({
  bankAccountId,

  // #withDialogActions
  closeDialog,
}: DisconnectBankAccountDialogContentProps) {
  const { mutateAsync: disconnectBankAccount } = useDisconnectBankAccount();

  const handleSubmit = (
    values: DisconnectFormValues,
    { setErrors, setSubmitting }: FormikHelpers<DisconnectFormValues>,
  ) => {
    debugger;
    setSubmitting(true);

    if (values.label !== 'DISCONNECT ACCOUNT') {
      setErrors({
        label: 'The entered value is incorrect.',
      });
      setSubmitting(false);
      return;
    }
    disconnectBankAccount({ bankAccountId })
      .then(() => {
        setSubmitting(false);
        AppToaster.show({
          message: 'The bank account has been disconnected.',
          intent: Intent.SUCCESS,
        });
        closeDialog(DialogsName.DisconnectBankAccountConfirmation);
      })
      .catch((error) => {
        setSubmitting(false);
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  const handleCancelBtnClick = () => {
    closeDialog(DialogsName.DisconnectBankAccountConfirmation);
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      validationSchema={Schema}
      initialValues={initialValues}
    >
      <Form>
        <div className={Classes.DIALOG_BODY}>
          <FFormGroup
            label={`Type "DISCONNECT ACCOUNT"`}
            name={'label'}
            fastField
          >
            <FInputGroup name={'label'} fastField />
          </FFormGroup>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button type="submit" intent={Intent.DANGER}>
              Disconnect Bank Account
            </Button>

            <Button intent={Intent.NONE} onClick={handleCancelBtnClick}>
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    </Formik>
  );
}

export default R.compose(withDialogActions)(DisconnectBankAccountDialogContent);
