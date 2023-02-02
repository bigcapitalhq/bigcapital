// @ts-nocheck
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Button, Tooltip, Classes } from '@blueprintjs/core';

export function InputPrependButton({
  buttonProps = {},
  tooltip = false,
  tooltipProps = {},
}) {
  const appendButton = useMemo(
    () => (
      <Button
        className={classNames('input-prepend__button', Classes.SMALL)}
        {...buttonProps}
      />
    ),
    [buttonProps],
  );

  const appendButtonWithTooltip = useMemo(
    () => <Tooltip {...tooltipProps}>{appendButton}</Tooltip>,
    [tooltipProps, appendButton],
  );

  return (
    <div class="input-prepend">
      {tooltip ? appendButtonWithTooltip : appendButton}
    </div>
  );
}
