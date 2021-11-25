import React from 'react';

import { Button, NavbarGroup, Classes, Intent } from '@blueprintjs/core';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { useInventoryAdjustmentDrawerContext } from './InventoryAdjustmentDrawerProvider';

import withAlertsActions from 'containers/Alert/withAlertActions';

import { Icon, FormattedMessage as T, Can } from 'components';
import {
  Inventory_Adjustment_Abilities,
  AbilitySubject,
} from '../../../common/abilityOption';

import { compose } from 'utils';

/**
 * Inventory adjustment detail actions bar.
 */
function InventoryAdjustmentDetailActionsBar({
  // #withAlertsActions
  openAlert,
}) {
  const { inventoryId } = useInventoryAdjustmentDrawerContext();

  // Handle delete inventory adjustment.
  const handleDeleteInventoryAdjustment = () => {
    openAlert('inventory-adjustment-delete', { inventoryId });
  };

  return (
    <Can
      I={Inventory_Adjustment_Abilities.Delete}
      a={AbilitySubject.Inventory_Adjustment}
    >
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteInventoryAdjustment}
          />
        </NavbarGroup>
      </DashboardActionsBar>
    </Can>
  );
}

export default compose(withAlertsActions)(InventoryAdjustmentDetailActionsBar);
