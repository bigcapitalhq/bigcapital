import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useCustomersListContext } from './CustomersListProvider';
import { withCustomers } from './withCustomers';
import { withCustomersActions } from './withCustomersActions';
import type { WithCustomersProps } from './withCustomers';
import type { WithCustomersActionsProps } from './withCustomersActions';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { DashboardViewsTabs } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { compose, transfromViewsToTabs } from '@/utils';

interface CustomersViewsTabsInnerProps
  extends Pick<WithCustomersProps, 'customersTableState'>,
    WithCustomersActionsProps,
    WithDashboardActionsProps {
  customersCurrentView: string | null | undefined;
}

/**
 * Customers views tabs.
 */
function CustomersViewsTabsInner({
  // #withCustomersActions
  setCustomersTableState,

  // #withCustomers
  customersCurrentView,
}: CustomersViewsTabsInnerProps) {
  // Customers list context.
  const { customersViews } = useCustomersListContext();

  // Transformes the views to tabs.
  const tabs = transfromViewsToTabs(customersViews);

  // Handle tabs change.
  const handleTabsChange = (viewSlug: string) => {
    setCustomersTableState({ viewSlug: viewSlug || null });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={customersCurrentView}
          resourceName={'customers'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const CustomersViewsTabs = compose(
  withDashboardActions,
  withCustomersActions,
  withCustomers(({ customersTableState }) => ({
    customersCurrentView: customersTableState.viewSlug,
  })),
)(CustomersViewsTabsInner);
