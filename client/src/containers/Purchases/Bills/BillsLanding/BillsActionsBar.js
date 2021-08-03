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
  Alignment,
} from '@blueprintjs/core';

import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import { If, DashboardActionViewsList } from 'components';

import withBillsActions from './withBillsActions';
import { useBillsListContext } from './BillsListProvider';
import { useRefreshBills } from 'hooks/query/bills';
import { compose } from 'utils';

/**
 * Bills actions bar.
 */
function BillActionsBar({
  // #withBillActions
  setBillsTableState,
}) {
  const history = useHistory();

  // Bills refresh action.
  const { refresh } = useRefreshBills();

  // Bills list context.
  const { billsViews } = useBillsListContext();

  const [filterCount] = useState(0);

  // Handle click a new bill.
  const handleClickNewBill = () => {
    history.push('/bills/new');
  };

  // Handle tab change.
  const handleTabChange = (customView) => {
    setBillsTableState({
      customViewId: customView.id || null,
    });
  };

  // Handle click a refresh bills
  const handleRefreshBtnClick = () => {
    refresh();
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
                `${filterCount} ${intl.get('filters_applied')}`
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
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(withBillsActions)(BillActionsBar);
