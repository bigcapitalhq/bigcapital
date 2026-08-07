import {
  Menu,
  MenuItem,
  MenuDivider,
  Button,
  Popover,
  Position,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useAuthenticatedAccount } from '@/hooks/query';
import { useAuthActions, useAuthOrganizationId } from '@/hooks/state';
import { firstLettersArgs, compose } from '@/utils';

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
export default compose(withDialogActions)(DashboardTopbarUser);
