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
import { If, Icon } from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import FilterDropdown from 'components/FilterDropdown';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import withItemCategories from './withItemCategories';
import withItemCategoriesActions from './withItemCategoriesActions';

import { compose } from 'utils';

const ItemsCategoryActionsBar = ({
  // #withResourceDetail
  resourceFields,

  // #withDialog
  openDialog,

  // #withItemCategories
  categoriesViews,

  // #withItemCategoriesActions
  addItemCategoriesTableQueries,

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

  // const filterDropdown = FilterDropdown({
  //   fields: resourceFields,
  //   initialCondition: {
  //     fieldKey: 'name',
  //     compatator: 'contains',
  //     value: '',
  //   },
  //   onFilterChange: (filterConditions) => {
  //     setFilterCount(filterConditions.length || 0);
  //     addItemCategoriesTableQueries({
  //       filter_roles: filterConditions || '',
  //     });
  //     onFilterChanged && onFilterChanged(filterConditions);
  //   },
  // });

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

        <If condition={hasSelectedRows}>
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
  // withItemCategories(({ categoriesViews }) => ({
  //   categoriesViews,
  // })),
  withItemCategoriesActions,
)(ItemsCategoryActionsBar);
