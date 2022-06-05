import intl from 'react-intl-universal';

import withDrawerActions from '../Drawer/withDrawerActions';

import { RESOURCES_TYPES } from '../../common/resourcesTypes';
import { AbilitySubject, ItemAction } from '../../common/abilityOption';

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
}) {
  if (resourceType === RESOURCES_TYPES.ITEM) {
    openDrawer('item-detail-drawer', { itemId: resourceId });
    onAction && onAction();
  }
  return null;
}

export const ItemUniversalSearchSelectAction = withDrawerActions(
  ItemUniversalSearchSelectComponent,
);

/**
 * Transformes items to search.
 * @param {*} item
 * @returns
 */
const transfromItemsToSearch = (item) => ({
  id: item.id,
  text: item.name,
  subText: item.code,
  label: item.type_formatted,
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
