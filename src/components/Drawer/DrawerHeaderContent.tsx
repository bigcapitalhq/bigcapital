import React from 'react';
import { FormattedMessage as T } from '@/components';
import { Classes, Icon, H4, Button } from '@blueprintjs/core';

import withDrawerActions from 'containers/Drawer/withDrawerActions';

import styled from 'styled-components';
import { compose } from 'utils';

/**
 * Drawer header content.
 */
function DrawerHeaderContent(props) {
  const {
    icon,
    title = <T id={'view_paper'} />,
    subTitle,
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
      <H4>
        {title}
        <SubTitle>{subTitle}</SubTitle>
      </H4>

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

/**
 * SubTitle Drawer header.
 * @returns {React.JSX}
 */
function SubTitle({ children }) {
  if (children == null) {
    return null;
  }

  return <SubTitleHead>{children}</SubTitleHead>;
}

const SubTitleHead = styled.div`
  color: #666;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  padding: 2px 0px;
  margin: 2px 0px;
`;
