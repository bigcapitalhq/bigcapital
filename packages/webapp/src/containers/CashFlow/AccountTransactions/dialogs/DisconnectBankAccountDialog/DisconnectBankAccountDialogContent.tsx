import { Button, Intent, Classes } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster, FFormGroup, FInputGroup } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useDisconnectBankAccount } from '@/hooks/query/banking';
import { compose } from '@/utils';

interface DisconnectFormValues {
  label: string;
}

const initialValues: DisconnectFormValues = {
  label: '',
};

const Schema = Yup.object().shape({
  label: Yup.string().required().label('Confirmation'),
});

interface DisconnectBankAccountDialogContentProps
  extends Pick<WithDialogActionsProps, 'closeDialog'> {
  bankAccountId: number;
  dialogName?: string;
}

function DisconnectBankAccountDialogContentInner({
  bankAccountId,

  // #withDialogActions
  closeDialog,
}: DisconnectBankAccountDialogContentProps) {
  const { mutateAsync: disconnectBankAccount } = useDisconnectBankAccount();

  const handleSubmit = (
    values: DisconnectFormValues,
    { setErrors, setSubmitting }: FormikHelpers<DisconnectFormValues>,
  ) => {
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
      .catch(() => {
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

export const DisconnectBankAccountDialogContent = compose(withDialogActions)(
  DisconnectBankAccountDialogContentInner,
);
