// @ts-nocheck
import * as R from 'ramda';
import { Button, Intent } from '@blueprintjs/core';
import { EmptyStatus, Can, FormattedMessage as T } from '@/components';
import { AbilitySubject, BankRuleAction } from '@/constants/abilityOption';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';
import styles from './BankRulesLandingEmptyState.module.scss';

function BankRulesLandingEmptyStateRoot({
  // #withDialogAction
  openDialog,
}) {
  const handleNewBtnClick = () => {
    openDialog(DialogsName.BankRuleForm);
  };

  return (
    <EmptyStatus
      title={'Create rules to categorize bank transactions automatically'}
      description={
        <p>
          Bank rules will run automatically to categorize the incoming bank
          transactions under the conditions you set up.
        </p>
      }
      action={
        <>
          <Can I={BankRuleAction.Create} a={AbilitySubject.BankRule}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={handleNewBtnClick}
            >
              New Bank Rule
            </Button>

            <Button intent={Intent.NONE} large={true}>
              <T id={'learn_more'} />
            </Button>
          </Can>
        </>
      }
      classNames={{ root: styles.root }}
    />
  );
}

export const BankRulesLandingEmptyState = R.compose(withDialogActions)(
  BankRulesLandingEmptyStateRoot,
);
