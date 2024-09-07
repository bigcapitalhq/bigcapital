import {
  InputGroup,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import styles from './ColorField.module.scss';

export function ColorField() {
  const [color, setColor] = useState('#aabbcc');

  return (
    <Popover
      content={<HexColorPicker color={color} onChange={setColor} />}
      position={Position.BOTTOM}
      interactionKind={PopoverInteractionKind.CLICK}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      minimal
    >
      <InputGroup
        leftElement={<div className={styles.colorPicker}></div>}
        className={styles.field}
      />
    </Popover>
  );
}
