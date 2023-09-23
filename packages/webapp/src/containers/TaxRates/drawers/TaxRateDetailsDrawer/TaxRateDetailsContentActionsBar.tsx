// @ts-nocheck
import React from 'react';
import {
  Button,
  Classes,
  Intent,
  Menu,
  MenuItem,
  NavbarDivider,
  NavbarGroup,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import * as R from 'ramda';
import { AppToaster, Can, DashboardActionsBar, Icon } from '@/components';
import { AbilitySubject, TaxRateAction } from '@/constants/abilityOption';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { useTaxRateDetailsContext } from './TaxRateDetailsContentBoot';
import { DialogsName } from '@/constants/dialogs';
import {
  useActivateTaxRate,
  useInactivateTaxRate,
} from '@/hooks/query/taxRates';

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
  const { taxRateId, taxRate } = useTaxRateDetailsContext();

  const { mutateAsync: activateTaxRateMutate } = useActivateTaxRate();
  const { mutateAsync: inactivateTaxRateMutate } = useInactivateTaxRate();

  // Handle edit tax rate.
  const handleEditTaxRate = () => {
    openDialog(DialogsName.TaxRateForm, { id: taxRateId });
  };
  // Handle delete tax rate.
  const handleDeleteTaxRate = () => {
    openAlert('tax-rate-delete', { taxRateId });
  };
  // Handle activate tax rate.
  const handleActivateTaxRate = () => {
    activateTaxRateMutate(taxRateId)
      .then(() => {
        AppToaster.show({
          message: 'The tax rate has been activated successfully.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };
  // Handle inactivate tax rate.
  const handleInactivateTaxRate = () => {
    inactivateTaxRateMutate(taxRateId)
      .then(() => {
        AppToaster.show({
          message: 'The tax rate has been inactivated successfully.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
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

        <Can I={TaxRateAction.Edit} a={AbilitySubject.TaxRate}>
          <NavbarDivider />
          <Popover
            minimal={true}
            interactionKind={PopoverInteractionKind.CLICK}
            position={Position.BOTTOM_LEFT}
            modifiers={{
              offset: { offset: '0, 4' },
            }}
            content={
              <Menu>
                {!taxRate.active && (
                  <MenuItem
                    text={'Activate Tax Rate'}
                    onClick={handleActivateTaxRate}
                  />
                )}
                {!!taxRate.active && (
                  <MenuItem
                    text={'Inactivate Tax Rate'}
                    onClick={handleInactivateTaxRate}
                  />
                )}
              </Menu>
            }
          >
            <Button
              icon={<Icon icon="more-vert" iconSize={16} />}
              minimal={true}
            />
          </Popover>
        </Can>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default R.compose(
  withDrawerActions,
  withDialogActions,
  withAlertsActions,
)(TaxRateDetailsContentActionsBar);
