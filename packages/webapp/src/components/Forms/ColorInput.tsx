import { useState } from 'react';
import clsx from 'classnames';
import {
  IInputGroupProps,
  InputGroup,
  IPopoverProps,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { HexColorPicker } from 'react-colorful';
import { useUncontrolled } from '@/hooks/useUncontrolled';
import { Box, BoxProps } from '@/components';
import { sanitizeToHexColor } from '@/utils/sanitize-hex-color';
import styles from './ColorInput.module.scss';

export interface ColorInputProps {
  value?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  popoverProps?: Partial<IPopoverProps>;
  inputProps?: Partial<IInputGroupProps>;
  pickerProps?: Partial<BoxProps>;
  pickerWrapProps?: Partial<BoxProps>;
}

export function ColorInput({
  value,
  initialValue,
  onChange,
  popoverProps,
  inputProps,
  pickerWrapProps,
  pickerProps,
}: ColorInputProps) {
  const [_value, handleChange] = useUncontrolled({
    value,
    initialValue,
    onChange,
    finalValue: '',
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Popover
      content={<HexColorPicker color={_value} onChange={handleChange} />}
      position={Position.BOTTOM}
      interactionKind={PopoverInteractionKind.CLICK}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      onClose={handleClose}
      isOpen={isOpen}
      minimal
      {...popoverProps}
    >
      <InputGroup
        value={_value}
        leftElement={
          <Box
            {...pickerWrapProps}
            style={{ padding: 8, ...pickerWrapProps?.style }}
          >
            <Box
              onClick={() => setIsOpen((oldValue) => !oldValue)}
              style={{ backgroundColor: _value }}
              className={clsx(styles.colorPicker, pickerProps?.className)}
              {...pickerProps}
            />
          </Box>
        }
        onChange={(e) => {
          const value = sanitizeToHexColor(e.currentTarget.value);
          handleChange(value);
        }}
        {...inputProps}
        className={clsx(styles.field, inputProps?.className)}
      />
    </Popover>
  );
}
