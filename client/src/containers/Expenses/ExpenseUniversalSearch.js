import { RESOURCES_TYPES } from 'common/resourcesTypes';
import withDrawerActions from '../Drawer/withDrawerActions';


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
