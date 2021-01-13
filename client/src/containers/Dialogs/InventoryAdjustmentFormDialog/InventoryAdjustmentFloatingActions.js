import React from 'react';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { saveInvoke } from 'utils';

export default function InventoryAdjustmentFloatingActions({
  onCloseClick,
  onSubmitClick,
}) {
  const { isSubmitting } = useFormikContext();

  const handleSubmitDraftBtnClick = (event) => {
    saveInvoke(onSubmitClick, event, {
      publish: false,
    });
  };
  const handleSubmitMakeAdjustmentBtnClick = (event) => {
    saveInvoke(onSubmitClick, event, {
      publish: true,
    });
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={onCloseClick} style={{ minWidth: '75px' }}>
          <T id={'close'} />
        </Button>

        <Button
          disabled={isSubmitting}
          style={{ minWidth: '75px' }}
          type="submit"
          onClick={handleSubmitDraftBtnClick}
        >
          {<T id={'save_as_draft'} />}
        </Button>
        <Button
          intent={Intent.PRIMARY}
          disabled={isSubmitting}
          style={{ minWidth: '75px' }}
          type="submit"
          onClick={handleSubmitMakeAdjustmentBtnClick}
        >
          {<T id={'make_adjustment'} />}
        </Button>
      </div>
    </div>
  );
}
