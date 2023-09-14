// @ts-nocheck
import React from 'react';
import {
  Button,
  Classes,
  Intent,
  NavbarDivider,
  NavbarGroup,
} from '@blueprintjs/core';
import * as R from 'ramda';
import { Can, DashboardActionsBar, Icon } from '@/components';
import { AbilitySubject, TaxRateAction } from '@/constants/abilityOption';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { useTaxRateDetailsContext } from './TaxRateDetailsContentBoot';
import { DialogsName } from '@/constants/dialogs';

/**
 * Tax rate details content actions bar.
 * @returns {JSX.Element}
 */
function TaxRateDetailsContentActionsBar({
  // #withDrawerActions
  openDialog,

  // #withAlertsActions
  openAlert,
}) {
  const { taxRateId } = useTaxRateDetailsContext();

  // Handle edit tax rate.
  const handleEditTaxRate = () => {
    openDialog(DialogsName.TaxRateForm, { id: taxRateId });
  };
  // Handle delete tax rate.
  const handleDeleteTaxRate = () => {
    openAlert('tax-rate-delete', { taxRateId });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Can I={TaxRateAction.Edit} a={AbilitySubject.TaxRate}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={'Edit Tax Rate'}
            onClick={handleEditTaxRate}
          />
        </Can>
        <Can I={TaxRateAction.Delete} a={AbilitySubject.Item}>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            text={'Delete'}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            intent={Intent.DANGER}
            onClick={handleDeleteTaxRate}
          />
        </Can>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default R.compose(
  withDrawerActions,
  withDialogActions,
  withAlertsActions
)(TaxRateDetailsContentActionsBar);
