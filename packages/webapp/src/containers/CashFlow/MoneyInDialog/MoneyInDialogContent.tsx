// @ts-nocheck
import { MoneyInDialogProvider } from './MoneyInDialogProvider';
import MoneyInForm from './MoneyInForm';

/**
 * Money in dialog content.
 */
export default function MoneyInDialogContent({
  // #ownProps
  dialogName,
  accountId,
  accountType,
}) {
  return (
    <MoneyInDialogProvider
      accountId={accountId}
      accountType={accountType}
      dialogName={dialogName}
    >
      <MoneyInForm />
    </MoneyInDialogProvider>
  );
}
