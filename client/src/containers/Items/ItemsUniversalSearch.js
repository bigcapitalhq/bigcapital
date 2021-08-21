import { RESOURCES_TYPES } from '../../common/resourcesTypes';
import withDrawerActions from '../Drawer/withDrawerActions';

/**
 * Item univrsal search item select action.
 */
function ItemUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.ITEM) {

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
  text: item.name,
  subText: item.code,
  label: item.type,
  reference: item,
});

/**
 * Binds universal search invoice configure.
 */
export const universalSearchItemBind = () => ({
  resourceType: RESOURCES_TYPES.ITEM,
  optionItemLabel: 'Items',
  selectItemAction: ItemUniversalSearchSelectAction,
  itemSelect: transfromItemsToSearch,
});
