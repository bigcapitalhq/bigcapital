import {
  IInputGroupProps,
  InputGroup,
  IPopoverProps,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import clsx from 'classnames';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import styles from './ColorInput.module.scss';
import { Box, BoxProps } from '@/components';
import { useUncontrolled } from '@/hooks/useUncontrolled';
import { sanitizeToHexColor } from '@/utils/sanitize-hex-color';

/** `#rgb` or `#rrggbb`. */
const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Fallback fed to `<HexColorPicker>` when the field is empty or holds a
 * partially-typed value. react-colorful runs the raw string through its
 * hex→HSV math unconditionally; an invalid value yields `NaN` channels, and
 * dragging the hue bar then paints the swatch as `NaN, NaN, NaN`.
 */
const FALLBACK_PICKER_COLOR = '#000000';

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

  const pickerColor = HEX_COLOR_REGEX.test(_value)
    ? _value
    : FALLBACK_PICKER_COLOR;

  return (
    <Popover
      content={<HexColorPicker color={pickerColor} onChange={handleChange} />}
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
