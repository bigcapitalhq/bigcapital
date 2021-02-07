import React from 'react';
import { Menu, MenuItem, MenuDivider, Intent } from '@blueprintjs/core';
import { Icon, If } from 'components';
import { useIntl } from 'react-intl';

import withDialogs from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';
import { formatMessage } from 'services/intl';

/**
 * Account actions menu list.
 */
export default function AccountActionsMenuList({
  account,

  // #withAlert
  openAlert,
  openDialog,
}) {
  const { formatMessage } = useIntl();

  
  return (
    
  );
}

// export default compose(withDialogs, withAlertsActions)(AccountActionsMenuList);
