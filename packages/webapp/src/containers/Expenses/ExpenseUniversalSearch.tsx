import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';

interface ExpenseUniversalSearchItemSelectProps extends WithDrawerActionsProps {
  resourceType: string;
  resourceId: number;
}

/**
 * Universal search bill item select action.
 */
function ExpenseUniversalSearchItemSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}: ExpenseUniversalSearchItemSelectProps) {
  if (resourceType === RESOURCES_TYPES.EXPENSE) {
    openDrawer(DRAWERS.EXPENSE_DETAILS, { expenseId: resourceId });
  }
  return null;
}

export const ExpenseUniversalSearchItemSelect = withDrawerActions(
  ExpenseUniversalSearchItemSelectComponent,
);
