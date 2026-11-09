import {
  Classes,
  Icon,
  IconName,
  IconSize,
  H4,
  Button,
} from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import styled from 'styled-components';
import { useDrawerContext } from './DrawerProvider';
import { FormattedMessage as T } from '@/components';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';

export interface DrawerHeaderContentProps {
  /** Accepted for convenience; the active drawer name is read from context. */
  name?: string;
  icon?: IconName;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
}

type DrawerHeaderContentInnerProps = DrawerHeaderContentProps &
  WithDrawerActionsProps;

/**
 * Drawer header content.
 */
function DrawerHeaderContentRoot(props: DrawerHeaderContentInnerProps) {
  const {
    icon,
    title = <T id={'view_paper'} />,
    subTitle,
    closeDrawer,
  } = props;
  const { name } = useDrawerContext();

  if (title == null) {
    return null;
  }
  const handleClose = () => {
    closeDrawer(name);
  };

  return (
    <div className={Classes.DRAWER_HEADER}>
      <Icon icon={icon as IconName} iconSize={IconSize.LARGE} />
      <H4>
        {title}
        <SubTitle>{subTitle}</SubTitle>
      </H4>

      <Button
        aria-label="Close"
        className={Classes.DIALOG_CLOSE_BUTTON}
        icon={<Icon icon="small-cross" iconSize={IconSize.LARGE} />}
        minimal={true}
        onClick={handleClose}
      />
    </div>
  );
}

export const DrawerHeaderContent = FF.pipe(
  DrawerHeaderContentRoot,
  withDrawerActions,
);

export interface SubTitleProps {
  children?: React.ReactNode;
}

/**
 * SubTitle Drawer header.
 */
function SubTitle({ children }: SubTitleProps) {
  if (children == null) {
    return null;
  }

  return <SubTitleHead>{children}</SubTitleHead>;
}

const SubTitleHead = styled.div`
  --x-color-text: #666;

  .bp4-dark & {
    --x-color-text: rgba(255, 255, 255, 0.6);
  }
  color: var(--x-color-text);
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  padding: 2px 0px;
  margin: 2px 0px;
`;
