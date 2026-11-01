import { Button, Classes, NavbarGroup } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { Can, DashboardActionsBar, Icon } from '@/components';
import { AbilitySubject, BankRuleAction } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

function RulesListActionsBarRoot({
  // #withDialogActions
  openDialog,
}: WithDialogActionsProps) {
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

export const RulesListActionsBar = FF.pipe(
  RulesListActionsBarRoot,
  withDialogActions,
);
