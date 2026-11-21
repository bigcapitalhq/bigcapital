import {
  Menu,
  MenuItem,
  MenuDivider,
  Button,
  Popover,
  Position,
} from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { AppearanceIcon } from './AppearanceIcon';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { ThemePreference } from '@/utils/theme-preference';
import { FormattedMessage as T, SegmentedControl } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useAuthenticatedAccount } from '@/hooks/query';
import { useAuthActions, useAuthOrganizationId } from '@/hooks/state';
import { useThemePreference } from '@/hooks/useThemePreference';
import { firstLettersArgs } from '@/utils';
import { THEME_PREFERENCES } from '@/utils/theme-preference';

/**
 * Dashboard topbar user.
 */
function DashboardTopbarUser({
  // #withDialogActions
  openDialog,
}: Pick<WithDialogActionsProps, 'openDialog'>) {
  const history = useHistory();
  const { setLogout } = useAuthActions();

  // Retrieve authenticated user information.
  const { data: user } = useAuthenticatedAccount();
  const organizationId = useAuthOrganizationId();
  const { preference, setThemePreference } = useThemePreference();
  const appearanceItems = THEME_PREFERENCES.map((value) => ({
    value,
    label: (
      <AppearanceIcon
        preference={value}
        label={intl.get(`appearance.${value}`)}
      />
    ),
  }));

  const onClickLogout = () => {
    setLogout();
  };

  const onKeyboardShortcut = () => {
    openDialog('keyboard-shortcuts');
  };

  return (
    <Popover
      content={
        <Menu className={'menu--logged-user-dropdown'}>
          <MenuItem
            multiline={true}
            className={'menu-item--profile'}
            text={
              <div>
                <div className="person">
                  {user.firstName} {user.lastName}
                </div>
                <div className="org">
                  <T id="organization_id" />: {organizationId}
                </div>
              </div>
            }
          />
          <MenuDivider />
          <li
            className={'menu-item--appearance'}
            data-testId={'appearance-switch'}
          >
            <span>
              <T id={'appearance.title'} />
            </span>
            <SegmentedControl<ThemePreference>
              items={appearanceItems}
              value={preference}
              onChange={setThemePreference}
            />
          </li>
          <MenuDivider />
          <MenuItem
            text={<T id={'keyboard_shortcuts'} />}
            onClick={onKeyboardShortcut}
          />
          <MenuItem
            text={<T id={'preferences'} />}
            onClick={() => history.push('/preferences')}
          />
          <MenuItem text={<T id={'logout'} />} onClick={onClickLogout} />
        </Menu>
      }
      position={Position.BOTTOM}
    >
      <Button>
        <div className="user-text">
          {firstLettersArgs(user.firstName, user.lastName)}
        </div>
      </Button>
    </Popover>
  );
}
export default FF.pipe(DashboardTopbarUser, withDialogActions);
