// @ts-nocheck
import { useCallback, useRef } from 'react';
import { useFormikContext } from 'formik';
import { Button, Icon, Position } from '@blueprintjs/core';
import { SelectOptionProps } from '@blueprintjs-formik/select';
import { FormGroupProps, TextAreaProps } from '@blueprintjs-formik/core';
import { css } from '@emotion/css';
import { FFormGroup, FSelect, FTextArea, Group, Stack } from '@/components';
import { InvoiceSendMailFormValues } from '../../Invoices/InvoiceSendMailDrawer/_types';

interface SendMailViewMessageFieldProps {
  argsOptions?: Array<SelectOptionProps>;
  formGroupProps?: Partial<FormGroupProps>;
  selectProps?: Partial<any>;
  textareaProps?: Partial<TextAreaProps>;
}

export function SendMailViewMessageField({
  argsOptions,
  formGroupProps,
  textareaProps,
}: SendMailViewMessageFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setFieldValue } = useFormikContext<InvoiceSendMailFormValues>();

  const handleTextareaChange = useCallback(
    (item: SelectOptionProps) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd, value: text } = textarea;
      const insertText = `{${item.value}}`;
      const message =
        text.substring(0, selectionStart) +
        insertText +
        text.substring(selectionEnd);

      setFieldValue('message', message);

      // Move the cursor to the end of the inserted text
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          selectionStart + insertText.length;
        textarea.focus();
      }, 0);
    },
    [setFieldValue],
  );

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent the form from submitting when the user presses the Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <FFormGroup label={'Message'} name={'message'} {...formGroupProps}>
      <Stack spacing={0}>
        <Group
          border={'1px solid #ced4da'}
          borderBottom={0}
          borderRadius={'3px 3px 0 0'}
        >
          <FSelect
            selectedItem={'customerName'}
            name={'item'}
            items={argsOptions}
            onItemChange={handleTextareaChange}
            popoverProps={{
              fill: false,
              position: Position.BOTTOM_LEFT,
              minimal: true,
              inputProps: {
                onKeyDown: handleTagInputKeyDown,
              },
            }}
            input={() => (
              <Button
                minimal
                rightIcon={<Icon icon={'caret-down-16'} color={'#8F99A8'} />}
              >
                Insert Variable
              </Button>
            )}
            fill={false}
            fastField
          />
        </Group>

        <FTextArea
          inputRef={textareaRef}
          name={'message'}
          large
          fill
          fastField
          className={css`
            resize: vertical;
            min-height: 300px;
            border-top-right-radius: 0px;
            border-top-left-radius: 0px;
          `}
          {...textareaProps}
        />
      </Stack>
    </FFormGroup>
  );
}
