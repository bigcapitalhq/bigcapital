import intl from 'react-intl-universal';
import { RESOURCES_TYPES } from '../../common/resourcesTypes';
import withDrawerActions from '../Drawer/withDrawerActions';

function AccountUniversalSearchItemSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.ACCOUNT) {
    openDrawer('account-drawer', { accountId: resourceId });
  }
  return null;
}

export const AccountUniversalSearchItemSelect = withDrawerActions(
  AccountUniversalSearchItemSelectComponent,
);

/**
 * Transformes account item to search item.
 * @param {*} account 
 * @returns 
 */
const accountToSearch = (account) => ({
  text: `${account.name} - ${account.code}`,
  label: account.formatted_amount,
  reference: account,
});

/**
 * Binds universal search account configure.
 */
export const universalSearchAccountBind = () => ({
  resourceType: RESOURCES_TYPES.ACCOUNT,
  optionItemLabel: intl.get('accounts'),
  selectItemAction: AccountUniversalSearchItemSelect,
  itemSelect: accountToSearch,
});
