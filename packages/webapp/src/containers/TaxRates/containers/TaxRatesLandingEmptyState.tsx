import { Button, Intent } from '@blueprintjs/core';
import * as R from 'ramda';
import { EmptyStatus, Can, FormattedMessage as T } from '@/components';
import { SaleInvoiceAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';

function TaxRatesLandingEmptyStateRoot({
  openDialog,
}: Pick<WithDialogActionsProps, 'openDialog'>) {
  return (
    <EmptyStatus
      title={"The organization doesn't have taxes, yet!"}
      description={
        <p>
          Setup the organization taxes to start tracking taxes on sales
          transactions.
        </p>
      }
      action={
        <>
          <Can I={SaleInvoiceAction.Create} a={AbilitySubject.Invoice}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={() => {
                openDialog(DialogsName.TaxRateForm);
              }}
            >
              New tax rate
            </Button>
            <Button intent={Intent.NONE} large={true}>
              <T id={'learn_more'} />
            </Button>
          </Can>
        </>
      }
    />
  );
}

export const TaxRatesLandingEmptyState = R.compose(withDialogActions)(
  TaxRatesLandingEmptyStateRoot,
);
