import React, { useState } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  Classes,
  Popover,
  NavbarDivider,
  NavbarGroup,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';

import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { FormattedMessage as T, useIntl } from 'react-intl';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import { If, DashboardActionViewsList } from 'components';

import withBillActions from './withBillActions';
import { useBillsListContext } from './BillsListProvider';

import { compose } from 'utils';

/**
 * Bills actions bar.
 */
function BillActionsBar({
  //#withBillActions
  addBillsTableQueries,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  
  // Bills list context.
  const { billsViews } = useBillsListContext();
  
  const [filterCount] = useState(0);

  // Handle click a new bill.
  const handleClickNewBill = () => {
    history.push('/bills/new');
  };
  // Handle tab change.
  const handleTabChange = (viewId) => {
    addBillsTableQueries({
      custom_view_id: viewId.id || null,
    });
  };
 
  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'bills'}
          views={billsViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_bill'} />}
          onClick={handleClickNewBill}
        />
        <Popover
          minimal={true}
          content={[]}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL)}
            text={
              true ? (
                <T id={'filter'} />
              ) : (
                `${filterCount} ${formatMessage({ id: 'filters_applied' })}`
              )
            }
            icon={<Icon icon={'filter-16'} iconSize={16} />}
          />
        </Popover>
        <If condition={false}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            // onClick={handleBulkDelete}
          />
        </If>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'print-16'} iconSize={'16'} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-import-16'} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={'16'} />}
          text={<T id={'export'} />}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withBillActions,
)(BillActionsBar);
