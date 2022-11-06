// @ts-nocheck
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

/**
 * Universal search bill item select action.
 */
function ExpenseUniversalSearchItemSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.EXPENSE) {
    openDrawer('expense-drawer', { expenseId: resourceId });
  }
  return null;
}

export const ExpenseUniversalSearchItemSelect = withDrawerActions(
  ExpenseUniversalSearchItemSelectComponent,
);
