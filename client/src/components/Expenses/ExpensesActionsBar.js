import React from 'react';
import {
  Button,
  AnchorButton,
  Classes,
  NavbarGroup,
  Popover,
  MenuItem,
  PopoverInteractionKind,
  Position,
  Menu,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';
import { useRouteMatch } from 'react-router-dom'
import classNames from 'classnames';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import Icon from 'components/Icon';
import { FormattedMessage as T, useIntl } from 'react-intl';

export default function ExpensesActionsBar({

}) {
  const {path} = useRouteMatch();
  const onClickNewAccount = () => {};
  const views = [];

  const viewsMenuItems = views.map((view) => {
    return (<MenuItem href={`${path}/${view.id}/custom_view`} text={view.name} />);
  });
  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Popover
          content={<Menu>{viewsMenuItems}</Menu>}
          minimal={true}
          interactionKind={PopoverInteractionKind.HOVER}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--table-views')}
            icon={<Icon icon='table' />}
            text={<T id={'table_views'}/>}
            rightIcon={'caret-down'}
          />
        </Popover>

        <NavbarDivider />

        <AnchorButton
          className={Classes.MINIMAL}
          icon={<Icon icon='plus' />}
          href='/dashboard/expenses/new'
          text={<T id={'new_expense'}/>}
          onClick={onClickNewAccount}
        />
        <Button
          className={Classes.MINIMAL}
          intent={Intent.DANGER}
          icon={<Icon icon='plus' />}
          text={<T id={'delete'}/>}
          onClick={onClickNewAccount}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='plus' />}
          text={<T id={'bulk_update'}/>}
          onClick={onClickNewAccount}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-import' />}
          text={<T id={'import'}/>}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-export' />}
          text={<T id={'export'}/>}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}
