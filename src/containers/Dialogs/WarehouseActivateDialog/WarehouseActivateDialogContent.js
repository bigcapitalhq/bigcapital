import React from 'react';
import { Intent, Button, Callout, Classes } from '@blueprintjs/core';
import { DialogContent, T } from 'components';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * Warehouse activate dialog content.
 * @returns
 */
function WarehouseActivateDialogContent({
  // #ownProps
  dialogName,
  // #withDialogActions
  closeDialog,
}) {
  // Handle close button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };
  return (
    <DialogContent>
      <div className={Classes.DIALOG_BODY}>
        <Callout icon={null} intent={Intent.PRIMARY}>
          Aute esse eiusmod dolore ipsum dolor sint qui proident pariatur
          proident fugiat ea ad aliquip.
        </Callout>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleCancelBtnClick} style={{ minWidth: '85px' }}>
            <T id={'cancel'} />
          </Button>
          <Button
            intent={Intent.PRIMARY}
            style={{ minWidth: '95px' }}
            type="submit"
          >
            {<T id={'activate'} />}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default compose(withDialogActions)(WarehouseActivateDialogContent);
