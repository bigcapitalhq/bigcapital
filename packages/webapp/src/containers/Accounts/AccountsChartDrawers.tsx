import { DRAWERS } from '@/constants/drawers';
import { index as AccountDrawer } from '@/containers/Drawers/AccountDrawer';

export function AccountsChartDrawers() {
  return (
    <>
      <AccountDrawer name={DRAWERS.ACCOUNT_DETAILS} />
    </>
  );
}
