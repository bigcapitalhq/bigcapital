import React, { useCallback, useMemo, useState } from 'react';
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
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { If, Icon } from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import withItemCategories from './withItemCategories';
import withItemCategoriesActions from './withItemCategoriesActions';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

const ItemsCategoryActionsBar = ({
  // #withDialog
  openDialog,

  // #withItemCategories
  itemCategoriesSelectedRows,

  // #withAlertActions
  openAlert,

}) => {
  const [filterCount, setFilterCount] = useState(0);

  const onClickNewCategory = useCallback(() => {
    openDialog('item-category-form', {});
  }, [openDialog]);

  const handelBulkDelete = () => {
    openAlert('item-categories-bulk-delete', {
      itemCategoriesIds: itemCategoriesSelectedRows,
    });
  };
  console.log(itemCategoriesSelectedRows, 'EE');
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
              filterCount <= 0 ? (
                <T id={'filter'} />
              ) : (
                `${filterCount} filters applied`
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
};

export default compose(
  withDialogActions,
  withDashboardActions,
  withItemCategories(({ itemCategoriesSelectedRows }) => ({
    itemCategoriesSelectedRows,
  })),
  withItemCategoriesActions,
  withAlertActions,
)(ItemsCategoryActionsBar);
