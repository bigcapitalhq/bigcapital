// @ts-nocheck
import * as R from 'ramda';
import { Button, Intent } from '@blueprintjs/core';
import { EmptyStatus, Can, FormattedMessage as T } from '@/components';
import { AbilitySubject, BankRuleAction } from '@/constants/abilityOption';
import withDialogActions from '@/containers/Dialog/withDialogActions';

function BankRulesLandingEmptyStateRoot({
  // #withDialogAction
  openDialog,
}) {
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
          <Can I={BankRuleAction.Create} a={AbilitySubject.BankRule}>
            <Button intent={Intent.PRIMARY} large={true} onClick={() => {}}>
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

export const BankRulesLandingEmptyState = R.compose(withDialogActions)(
  BankRulesLandingEmptyStateRoot,
);
