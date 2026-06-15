// @ts-nocheck
import { Button, Classes, NavbarGroup } from '@blueprintjs/core';
import * as R from 'ramda';
import { Can, DashboardActionsBar, Icon } from '@/components';
import { AbilitySubject, BankRuleAction } from '@/constants/abilityOption';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';
import { flow } from 'fp-ts/function';

function RulesListActionsBarRoot({
  // #withDialogActions
  openDialog,
}) {
  const handleCreateBtnClick = () => {
    openDialog(DialogsName.BankRuleForm);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Can I={BankRuleAction.Create} a={AbilitySubject.BankRule}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={'New Bank Rule'}
            onClick={handleCreateBtnClick}
          />
        </Can>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const RulesListActionsBar = flow(withDialogActions)(
  RulesListActionsBarRoot,
);
