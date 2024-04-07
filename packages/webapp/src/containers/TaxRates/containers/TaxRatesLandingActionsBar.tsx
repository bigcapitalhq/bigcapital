// @ts-nocheck
import React from 'react';
import { NavbarGroup, NavbarDivider, Button, Classes } from '@blueprintjs/core';
import { DashboardActionsBar, FormattedMessage as T, Can, Icon } from '@/components';
import { AbilitySubject, TaxRateAction } from '@/constants/abilityOption';

import withDialogActions from '@/containers/Dialog/withDialogActions';

import { DialogsName } from '@/constants/dialogs';
import { compose } from '@/utils';

/**
 * Tax rates actions bar.
 */
function TaxRatesActionsBar({
  // #withDialogActions
  openDialog,
}) {
  // Handle `new item` button click.
  const onClickNewItem = () => {
    openDialog(DialogsName.TaxRateForm);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Can I={TaxRateAction.Create} a={AbilitySubject.TaxRate}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={'New Tax Rate'}
            onClick={onClickNewItem}
          />
        </Can>
        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(withDialogActions)(TaxRatesActionsBar);
