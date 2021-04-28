import React from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Classes, Icon, H4, Button } from '@blueprintjs/core';

import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

/**
 * Drawer header content.
 */
function DrawerHeaderContent(props) {
  const {
    icon,
    title = <T id={'view_paper'} />,
    onClose,
    name,
    closeDrawer,
  } = props;

  if (title == null) {
    return null;
  }

  const handleClose = (event) => {
    closeDrawer(name);
    onClose && onClose(event);
  };

  return (
    <div className={Classes.DRAWER_HEADER}>
      <Icon icon={icon} iconSize={Icon.SIZE_LARGE} />
      <H4>{title}</H4>

      <Button
        aria-label="Close"
        className={Classes.DIALOG_CLOSE_BUTTON}
        icon={<Icon icon="small-cross" iconSize={Icon.SIZE_LARGE} />}
        minimal={true}
        onClick={handleClose}
      />
    </div>
  );
}

export default compose(withDrawerActions)(DrawerHeaderContent);
