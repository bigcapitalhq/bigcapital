import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useVendorsListContext } from './VendorsListProvider';
import { withVendors } from './withVendors';
import { withVendorsActions } from './withVendorsActions';
import type { WithVendorsProps } from './withVendors';
import type { WithVendorsActionsProps } from './withVendorsActions';
import { DashboardViewsTabs } from '@/components';
import { transfromViewsToTabs, compose } from '@/utils';

interface VendorViewsTabsInnerProps
  extends Pick<WithVendorsProps, 'vendorsTableState'>,
    WithVendorsActionsProps {
  vendorsCurrentView: string | null | undefined;
}

/**
 * Vendors views tabs.
 */
function VendorViewsTabsInner({
  // #withVendorsActions
  setVendorsTableState,

  // #withVendors
  vendorsCurrentView,
}: VendorViewsTabsInnerProps) {
  const { vendorsViews } = useVendorsListContext();

  // Transformes the resource views to tabs.
  const tabs = transfromViewsToTabs(vendorsViews);

  // Handle dashboard tabs change.
  const handleTabsChange = (viewSlug: string) => {
    setVendorsTableState({ viewSlug });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={vendorsCurrentView}
          resourceName={'vendors'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const VendorViewsTabs = compose(
  withVendorsActions,
  withVendors(({ vendorsTableState }) => ({
    vendorsCurrentView: vendorsTableState.viewSlug,
  })),
)(VendorViewsTabsInner);
