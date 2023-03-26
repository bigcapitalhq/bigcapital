// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { Button, Classes, Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { FormattedMessage as T } from '@/components';

/**
 * Number format footer.
 */
export default function NumberFormatFooter({
  // #ownProps
  onCancelClick,
  submitDisabled
}) {
  return (
    <div className={classNames('number-format-dropdown__footer')}>
      <Button
        className={classNames('mr1', Classes.POPOVER_DISMISS)}
        onClick={onCancelClick}
        small={true}
      >
        <T id={'cancel'} />
      </Button>

      <Button
        intent={Intent.PRIMARY}
        disabled={submitDisabled}
        small={true}
        type="submit"
      >
        <T id={'run'} />
      </Button>
    </div>
  );
}
