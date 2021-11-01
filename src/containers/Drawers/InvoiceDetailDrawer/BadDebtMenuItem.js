import React from 'react';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Popover,
  PopoverInteractionKind,
  Position,
  Intent,
  MenuItem,
  Menu,
} from '@blueprintjs/core';
import { If, Icon, FormattedMessage as T } from 'components';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

function BadDebtMenuItem({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,
}) {
  // Invoice detail drawer context.
  const { invoiceId, invoice } = useInvoiceDetailDrawerContext();

  const handleBadDebtInvoiceDialog = () => {
    openDialog('invoice-bad-debt', { invoiceId });
  };

  const handleBadDebtInvoiceAlert = () => {
    openAlert('bad-debt', { invoiceId });
  };

  return (
    <Popover
      content={
        <Menu>
          <If condition={invoice.is_writtenoff}>
            <MenuItem
              text={<T id={'badDebt.label_cancel_bad_debt'} />}
              onClick={handleBadDebtInvoiceAlert}
            />
          </If>
          <MenuItem
            text={
              <T id={'badDebt.label'} onClick={handleBadDebtInvoiceDialog} />
            }
          />
        </Menu>
      }
      minimal={true}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      canOutsideClickClose={false}
      usePortal={false}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
    >
      <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
    </Popover>
  );
}
export default compose(withDialogActions, withAlertsActions)(BadDebtMenuItem);
