import React, { useCallback, useState, useMemo } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  Classes,
  Menu,
  MenuItem,
  Popover,
  NavbarDivider,
  NavbarGroup,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';

import classNames from 'classnames';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { FormattedMessage as T, useIntl } from 'react-intl';

import { connect } from 'react-redux';
import FilterDropdown from 'components/FilterDropdown';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { If, DashboardActionViewsList } from 'components';
import withResourceDetail from 'containers/Resources/withResourceDetails';

import withPaymentReceivesActions from './withPaymentReceivesActions';
import withPaymentReceives from './withPaymentReceives';

import { compose } from 'utils';

function PaymentReceiveActionsBar({
  // #withResourceDetail
  resourceFields,

  //#withPaymentReceives
  paymentReceivesViews,

  //#withPaymentReceivesActions
  addPaymentReceivesTableQueries,

  // #own Porps
  onFilterChanged,
  selectedRows = [],
}) {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [filterCount, setFilterCount] = useState(0);
  const { formatMessage } = useIntl();

  const handleClickNewPaymentReceive = useCallback(() => {
    history.push('/payment-receives/new');
  }, [history]);

  // const filterDropdown = FilterDropdown({
  //   initialCondition: {
  //     fieldKey: '',
  //     compatator: 'contains',
  //     value: '',
  //   },
  //   fields: resourceFields,
  //   onFilterChange: (filterConditions) => {
  //     addPaymentReceivesTableQueries({
  //       filter_roles: filterConditions || '',
  //     });
  //     onFilterChanged && onFilterChanged(filterConditions);
  //   },
  // });

  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [
    selectedRows,
  ]);

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'payment_receives'}
          views={paymentReceivesViews}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_payment_receive'} />}
          onClick={handleClickNewPaymentReceive}
        />
        <Popover
          minimal={true}
          // content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL)}
            text={
              filterCount <= 0 ? (
                <T id={'filter'} />
              ) : (
                `${filterCount} ${formatMessage({ id: 'filters_applied' })}`
              )
            }
            icon={<Icon icon={'filter-16'} iconSize={16} />}
          />
        </Popover>
        <If condition={hasSelectedRows}>
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

const mapStateToProps = (state, props) => ({
  resourceName: 'payment_receives',
});
const withPaymentReceiveActionsBar = connect(mapStateToProps);

export default compose(
  withPaymentReceiveActionsBar,
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withPaymentReceives(({ paymentReceivesViews }) => ({ paymentReceivesViews })),
)(PaymentReceiveActionsBar);
