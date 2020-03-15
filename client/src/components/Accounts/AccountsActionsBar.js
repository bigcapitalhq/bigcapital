import React, { useMemo } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  NavbarGroup,
  Navbar,
  Classes,
  NavbarDivider,
  MenuItem,
  Menu,
  Popover,
  PopoverInteractionKind,
  Position,
} from "@blueprintjs/core";
import classNames from 'classnames';
import {connect} from 'react-redux';
import {useRouteMatch} from 'react-router-dom';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import DialogConnect from 'connectors/Dialog.connector';
import AccountsConnect from 'connectors/Accounts.connector';
import {compose} from 'utils';

function AccountsActionsBar({
  openDialog,
  views,
  bulkActions,
}) {
  const {path} = useRouteMatch();
  const onClickNewAccount = () => { openDialog('account-form', {}); };

  const viewsMenuItems = views.map((view) => {
    return (<MenuItem href={`${path}/${view.id}/custom_view`} text={view.name} />);
  });

  const hasBulkActionsSelected = useMemo(() => {
    return Object.keys(bulkActions).length > 0;
  }, [bulkActions]);

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Popover
          content={<Menu>{viewsMenuItems}</Menu>}
          minimal={true}
          interactionKind={PopoverInteractionKind.HOVER}
          position={Position.BOTTOM_LEFT}>
          
          <Button
            className={classNames(Classes.MINIMAL, 'button--table-views')}
            icon={ <Icon icon="table" /> }
            text="Table Views"
            rightIcon={'caret-down'} />
        </Popover>

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={ <Icon icon="plus" /> }
          text="New Account"
          onClick={onClickNewAccount} />

        {hasBulkActionsSelected && (
          <Button
            className={Classes.MINIMAL}
            icon={ <Icon icon="trash" />} 
            text="Archive" />)}

        {hasBulkActionsSelected && (
          <Button
            className={Classes.MINIMAL}
            icon={ <Icon icon="trash" />} 
            text="Delete" />)}

        <Button
          className={Classes.MINIMAL}
          icon={ <Icon icon="file-import" /> }
          text="Import" />

        <Button
          className={Classes.MINIMAL}
          icon={ <Icon icon="file-export" /> }
          text="Export" />
      </NavbarGroup>
    </DashboardActionsBar>
  )
}

const mapStateToProps = (state) => {
  return {
    bulkActions: state.accounts.bulkActions,
  };
};

export default compose(
  DialogConnect,
  AccountsConnect,
  connect(mapStateToProps),
)(AccountsActionsBar);