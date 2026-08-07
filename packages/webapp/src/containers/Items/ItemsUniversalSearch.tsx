import intl from 'react-intl-universal';
import type { ItemTableRow } from './components';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AbilitySubject, ItemAction } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

interface ItemUniversalSearchSelectComponentProps
  extends WithDrawerActionsProps {
  resourceType: string;
  resourceId: number;
  onAction?: () => void;
}

/**
 * Item univrsal search item select action.
 */
function ItemUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,
  onAction,

  // #withDrawerActions
  openDrawer,
}: ItemUniversalSearchSelectComponentProps) {
  if (resourceType === RESOURCES_TYPES.ITEM) {
    openDrawer(DRAWERS.ITEM_DETAILS, { itemId: resourceId });
    onAction && onAction();
  }
  return null;
}

export const ItemUniversalSearchSelectAction = withDrawerActions(
  ItemUniversalSearchSelectComponent,
);

/**
 * Transformes items to search.
 */
const transfromItemsToSearch = (item: ItemTableRow) => ({
  id: item.id,
  text: item.name,
  subText: item.code,
  label: item.typeFormatted,
  reference: item,
});

/**
 * Binds universal search invoice configure.
 */
export const universalSearchItemBind = () => ({
  resourceType: RESOURCES_TYPES.ITEM,
  optionItemLabel: intl.get('items'),
  selectItemAction: ItemUniversalSearchSelectAction,
  itemSelect: transfromItemsToSearch,
  permission: {
    ability: ItemAction.View,
    subject: AbilitySubject.Item,
  },
});
