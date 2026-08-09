import {
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Intent,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { useItemsCategoriesContext } from './ItemsCategoriesProvider';
import { withItemCategories } from './withItemCategories';
import { withItemCategoriesActions } from './withItemCategoriesActions';
import type { WithItemCategoriesProps } from './withItemCategories';
import type { WithItemCategoriesActionsProps } from './withItemCategoriesActions';
import type { IFilterRole } from '@/components/AdvancedFilter/interfaces';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  If,
  Icon,
  FormattedMessage as T,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardActionsBar,
  DashboardRowsHeightButton,
} from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useSaveSettings } from '@/hooks/query';
import { compose } from '@/utils';

interface ItemsCategoryActionsBarInnerProps
  extends WithItemCategoriesActionsProps,
    WithDialogActionsProps,
    WithAlertActionsProps {
  // NOTE: `itemCategoriesSelectedRows` was destructured from the mapper in the
  // @ts-nocheck original even though `WithItemCategoriesProps` doesn't define
  // it — preserved latent bug; the value is `undefined` at runtime, which means
  // the bulk-delete button never renders.
  itemCategoriesSelectedRows: unknown[];
  categoriesFilterConditions: IFilterRole[];
}

/**
 * Items categories actions bar.
 */
function ItemsCategoryActionsBarInner({
  // #withItemCategories
  itemCategoriesSelectedRows = [],

  categoriesFilterConditions,

  //
  setItemsCategoriesTableState,

  // #withDialog
  openDialog,

  // #withAlertActions
  openAlert,
}: ItemsCategoryActionsBarInnerProps) {
  const { mutateAsync: saveSettings } = useSaveSettings();
  const { fields, itemsCategoriesSettings } = useItemsCategoriesContext();
  const itemsCategoriesTableSize = itemsCategoriesSettings?.tableSize as
    | string
    | undefined;
  const history = useHistory();

  const onClickNewCategory = () => {
    openDialog('item-category-form', {});
  };

  const handleImportBtnClick = () => {
    history.push('/item/categories/import');
  };

  // Handle the items categories bulk delete.
  const handelBulkDelete = () => {
    openAlert('item-categories-bulk-delete', {
      itemCategoriesIds: itemCategoriesSelectedRows,
    });
  };
  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'item_category' });
  };
  // Handle table row size change.
  const handleTableRowSizeChange = (size: string) => {
    saveSettings({
      options: [{ group: 'item_categories', key: 'table_size', value: size }],
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

        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: categoriesFilterConditions,
            defaultFieldKey: 'name',
            fields: fields,
            onFilterChange: (filterConditions: IFilterRole[]) => {
              setItemsCategoriesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={categoriesFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <If condition={!!itemCategoriesSelectedRows?.length}>
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
          onClick={handleImportBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={itemsCategoriesTableSize}
          onChange={handleTableRowSizeChange}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const ItemsCategoryActionsBar = compose(
  withDialogActions,
  withItemCategories(
    // `itemCategoriesSelectedRows` is not on `WithItemCategoriesProps` — the
    // @ts-nocheck original destructured it anyway, so the value is `undefined`.
    // Preserved latent bug.
    ({ itemsCategoriesTableState }) => ({
      itemCategoriesSelectedRows: undefined,
      categoriesFilterConditions: itemsCategoriesTableState.filterRoles,
    }),
  ),
  withAlertActions,
  withItemCategoriesActions,
)(ItemsCategoryActionsBarInner);
