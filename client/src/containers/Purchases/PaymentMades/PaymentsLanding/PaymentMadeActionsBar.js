import React from 'react';
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
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import { If, DashboardActionViewsList } from 'components';

import withPaymentMadeActions from './withPaymentMadeActions';
import { usePaymentMadesListContext } from './PaymentMadesListProvider';

import { compose } from 'utils';

/**
 * Payment made actions bar.
 */
function PaymentMadeActionsBar({
  // #withPaymentMadesActions
  setPaymentMadesTableState,
}) {
  const history = useHistory();
  

  // Payment receives list context.
  const { paymentMadesViews } = usePaymentMadesListContext();

  // Handle new payment made button click.
  const handleClickNewPaymentMade = () => {
    history.push('/payment-mades/new');
  };

  // Handle tab changing.
  const handleTabChange = (customView) => {
    setPaymentMadesTableState({ customViewId: customView.id || null });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'bill_payments'}
          views={paymentMadesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_payment_made'} />}
          onClick={handleClickNewPaymentMade}
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
              true ? (
                <T id={'filter'} />
              ) : (
                `${0} ${intl.get('filters_applied')}`
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

export default compose(withPaymentMadeActions)(PaymentMadeActionsBar);
