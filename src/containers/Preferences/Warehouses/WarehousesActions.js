import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import { FormattedMessage as T, Icon } from 'components';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

/**
 * Warehouse actions.
 */
function WarehousesActions({
  //#ownProps
  openDialog,
}) {
  const handleClickNewWarehouse = () => {
    openDialog('warehouse-form');
  };

  return (
    <React.Fragment>
      <Button
        icon={<Icon icon="plus" iconSize={12} />}
        onClick={handleClickNewWarehouse}
        intent={Intent.PRIMARY}
      >
        <T id={'warehouses.label.new_warehouse'} />
      </Button>
    </React.Fragment>
  );
}

export default compose(withDialogActions)(WarehousesActions);
