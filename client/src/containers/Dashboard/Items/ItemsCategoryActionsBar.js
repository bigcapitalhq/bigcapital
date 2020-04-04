import React, { useMemo } from 'react';
import {} from 'reselect';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { compose } from 'utils';
import { NavbarGroup, Button, Classes, Intent } from '@blueprintjs/core';
import Icon from 'components/Icon';
import DashboardConnect from 'connectors/Dashboard.connector';
import ItemsCategoryConnect from 'connectors/ItemsCategory.connect';
import DialogConnect from 'connectors/Dialog.connector';

const ItemsCategoryActionsBar = ({ openDialog, onDeleteCategory }) => {
  const onClickNewCategory = () => {
    openDialog('item-form', {});
  };

  const handleDeleteCategory = category => {
    onDeleteCategory(category);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='plus' />}
          text='New Category'
          onClick={onClickNewCategory}
        />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='trash' iconSize={15} />}
          text='Delete Category'
          intent={Intent.DANGER}
          onClick={handleDeleteCategory}
        />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-import' />}
          text='Import'
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-export' />}
          text='Export'
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
};

export default compose(
  DialogConnect,
  DashboardConnect,
  ItemsCategoryConnect
)(ItemsCategoryActionsBar);
