import React from 'react';
import {
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Intent,
  Popover,
  Position,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import classNames from 'classnames';
import { If, Icon } from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withDialogActions from 'containers/Dialog/withDialogActions';
// import withItemCategories from './withItemCategories';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Items categories actions bar.
 */
function ItemsCategoryActionsBar({
  // #withItemCategories
  itemCategoriesSelectedRows = [],

  // #withDialog
  openDialog,

  // #withAlertActions
  openAlert,
}) {
  const onClickNewCategory = () => {
    openDialog('item-category-form', {});
  };

  // Handle the items categories bulk delete.
  const handelBulkDelete = () => {
    openAlert('item-categories-bulk-delete', {
      itemCategoriesIds: itemCategoriesSelectedRows,
    });
  };
  
  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="plus" />}
          text={<T id={'new_category'} />}
          onClick={onClickNewCategory}
        />
        <NavbarDivider />

        <Popover
          minimal={true}
          // content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
          canOutsideClickClose={true}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={
              true ? (
                <T id={'filter'} />
              ) : (
                `${0} filters applied`
              )
            }
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <If condition={itemCategoriesSelectedRows.length}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handelBulkDelete}
          />
        </If>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  // withItemCategories(({ itemCategoriesSelectedRows }) => ({
  //   itemCategoriesSelectedRows,
  // })),
  withAlertActions,
)(ItemsCategoryActionsBar);
