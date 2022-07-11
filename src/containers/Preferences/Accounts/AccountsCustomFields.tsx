import React, { useEffect } from 'react';
import {
  Popover,
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  Position,
  Icon,
} from '@blueprintjs/core';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
} from '@syncfusion/ej2-react-grids';
import useAsync from '@/hooks/async';
import { connect } from 'react-redux';
import { fetchResourceFields } from '@/store/customFields/customFields.actions';
import { FormattedMessage as T } from '@/components';

function AccountsCustomFields({ fetchResourceFields, fields }) {
  const fetchHook = useAsync(async () => {
    await Promise.all([
      // fetchResourceFields('accounts'),
    ]);
  }, false);

  useEffect(() => {
    fetchHook.execute();
  }, []);

  const actionMenuList = (column) => (
    <Menu>
      <MenuItem text={<T id={'view_details'} />} />
      <MenuDivider />
      <MenuItem text={<T id={'edit_account'} />} />
      <MenuItem text={<T id={'new_account'} />} />
      <MenuDivider />
      <MenuItem text={<T id={'inactivate_account'} />} />
      <MenuItem text={<T id={'delete_account'} />} />
    </Menu>
  );

  const statusRowTemplate = (column) => {
    return 'Active';
  };
  const actionsRowTemplate = (column) => (
    <Popover content={actionMenuList(column)} position={Position.RIGHT_BOTTOM}>
      <Button icon={<Icon icon="ellipsis-h" />} />
    </Popover>
  );

  const columns = [
    { field: 'label_name', headerText: 'Field Label' },
    { field: 'data_type', headerText: 'Type' },
    { template: statusRowTemplate, headerText: 'Status' },
    { template: actionsRowTemplate, headerText: '' },
  ];
  return (
    <div class="preferences__inside-content-tab preferences__inside-content-tab--custom-fields">
      <GridComponent dataSource={fields}>
        <ColumnsDirective>
          {columns.map((column) => {
            return (
              <ColumnDirective
                field={column.field}
                headerText={column.headerText}
                template={column.template}
              />
            );
          })}
        </ColumnsDirective>
      </GridComponent>
    </div>
  );
}

const mapStateToProps = (state) => ({
  fields: state.fields.custom_fields['accounts'] || [],
});
const mapDispatchToProps = (dispatch) => ({
  fetchResourceFields: (resourceSlug) =>
    dispatch(fetchResourceFields({ resourceSlug })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountsCustomFields);
