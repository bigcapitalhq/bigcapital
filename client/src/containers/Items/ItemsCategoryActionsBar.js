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
import { connect } from 'react-redux';

import Icon from 'components/Icon';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import FilterDropdown from 'components/FilterDropdown';
import { If } from 'components';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

const ItemsCategoryActionsBar = ({
  // #withResourceDetail
  resourceFields,

  // #withDialog
  openDialog,

  // #ownProps
  selectedRows = [],
  onFilterChanged,
  onBulkDelete,
}) => {
  const [filterCount, setFilterCount] = useState(0);

  const onClickNewCategory = useCallback(() => {
    openDialog('item-category-form', {});
  }, [openDialog]);

  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  // const handleDeleteCategory = useCallback((category) => {
  //   onDeleteCategory(selectedRows);
  // }, [selectedRows, onDeleteCategory]);

  const filterDropdown = FilterDropdown({
    fields: resourceFields,
    onFilterChange: (filterConditions) => {
      setFilterCount(filterConditions.length || 0);
      onFilterChanged && onFilterChanged(filterConditions);
    },
  });

  const handelBulkDelete = useCallback(() => {
    onBulkDelete && onBulkDelete(selectedRows.map((r) => r.id));
  }, [onBulkDelete, selectedRows]);

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
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={ filterCount <= 0 ? <T id={'filter'}/> : `${filterCount} filters applied`}
            icon={<Icon icon='filter-16' iconSize={16} />}
          />
        </Popover>

        <If condition={hasSelectedRows}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon='trash-16' iconSize={16} />}
            text={<T id={'delete'}/>}
            intent={Intent.DANGER}
            onClick={handelBulkDelete}
          />
        </If>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-import-16' iconSize={16} />}
          text={<T id={'import'}/>}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-export-16' iconSize={16} />}
          text={<T id={'export'}/>}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
};

const mapStateToProps = (state, props) => ({
  resourceName: 'items_categories',
});

const withItemsCategoriesActionsBar = connect(mapStateToProps);

export default compose(
  withItemsCategoriesActionsBar,
  withDialogActions,
  withDashboardActions,
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
)(ItemsCategoryActionsBar);
