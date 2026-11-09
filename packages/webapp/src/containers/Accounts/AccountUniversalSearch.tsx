import intl from 'react-intl-universal';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import type { Account } from '@bigcapital/sdk-ts';
import { AbilitySubject, AccountAction } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';

interface AccountUniversalSearchItemSelectProps extends WithDrawerActionsProps {
  resourceType: string;
  resourceId: number;
  onAction?: () => void;
}

function AccountUniversalSearchItemSelectComponent({
  resourceType,
  resourceId,
  onAction,

  openDrawer,
}: AccountUniversalSearchItemSelectProps) {
  if (resourceType === RESOURCES_TYPES.ACCOUNT) {
    openDrawer(DRAWERS.ACCOUNT_DETAILS, { accountId: resourceId });
    onAction && onAction();
  }
  return null;
}

export const AccountUniversalSearchItemSelect = withDrawerActions(
  AccountUniversalSearchItemSelectComponent,
);

const accountToSearch = (account: Account) => ({
  id: account.id,
  text: `${account.name} - ${account.code}`,
  label: account.formattedAmount,
  reference: account,
});

export const universalSearchAccountBind = () => ({
  resourceType: RESOURCES_TYPES.ACCOUNT,
  optionItemLabel: intl.get('accounts'),
  selectItemAction: AccountUniversalSearchItemSelect,
  itemSelect: accountToSearch,
  permission: {
    ability: AccountAction.View,
    subject: AbilitySubject.Account,
  },
});
