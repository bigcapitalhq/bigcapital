import React, {useState, useMemo, useCallback} from 'react';
import {Button} from '@blueprintjs/core';
import {Select} from '@blueprintjs/select';

export default function SelectList(props) {
  const {buttonLabel, ...rest} = props;

  return (
    <Select {...rest}>
      <Button
        rightIcon="caret-down"
        fill={true}>
          { buttonLabel }
      </Button>
    </Select>
  )
}