import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { useBadDebtContext } from './BadDebtFormProvider';
import type { BadDebtFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Bad bebt form floating actions.
 */
interface BadDebtFormFloatingActionsProps extends WithDialogActionsProps {}

function BadDebtFormFloatingActionsInner({
  closeDialog,
}: BadDebtFormFloatingActionsProps) {
  // bad debt invoice dialog context.
  const { dialogName } = useBadDebtContext();

  // Formik context.
  const { isSubmitting } = useFormikContext<BadDebtFormValues>();

  // Handle close button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '75px' }}>
          <T id={'cancel'} />
        </Button>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '75px' }}
          type="submit"
        >
          {<T id={'save'} />}
        </Button>
      </div>
    </div>
  );
}

export const BadDebtFormFloatingActions = compose(withDialogActions)(
  BadDebtFormFloatingActionsInner,
);
