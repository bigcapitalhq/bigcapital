import React from 'react';
import intl from 'react-intl-universal';
import '@/style/pages/Preferences/warehousesList.scss';
import { WarehousesGrid } from './WarehousesGrid';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { compose } from '@/utils';

interface WarehousesProps extends WithDashboardActionsProps {}

function WarehousesInner({
  changePreferencesPageTitle,
}: WarehousesProps): React.ReactElement {
  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('warehouses.label'));
  }, [changePreferencesPageTitle]);

  return (
    <React.Fragment>
      <WarehousesGrid />
    </React.Fragment>
  );
}
export const Warehouses = compose(withDashboardActions)(WarehousesInner);
