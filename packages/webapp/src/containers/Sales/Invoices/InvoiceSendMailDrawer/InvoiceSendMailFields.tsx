// @ts-nocheck
import { Button, Intent, MenuItem, Position } from '@blueprintjs/core';
import { useRef, useState, useMemo, useCallback } from 'react';
import { useFormikContext } from 'formik';
import { SelectOptionProps } from '@blueprintjs-formik/select';
import { css } from '@emotion/css';
import {
  FCheckbox,
  FFormGroup,
  FInputGroup,
  FMultiSelect,
  FSelect,
  FTextArea,
  Group,
  Icon,
  Stack,
} from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';
import { useInvoiceMailItems } from './_hooks';

// Create new account renderer.
const createNewItemRenderer = (query, active, handleClick) => {
  return (
    <MenuItem
      icon="add"
      text={'Now contact address'}
      active={active}
      onClick={handleClick}
    />
  );
};

// Create new item from the given query string.
const createNewItemFromQuery = (name) => ({ name });

const styleEmailButton = css`
  &.bp4-button.bp4-small {
    width: auto;
    margin: 0;
    min-height: 26px;
    line-height: 26px;
    padding-top: 0;
    padding-bottom: 0;
    font-size: 12px;
  }
`;

const fieldsWrapStyle = css`
  > :not(:first-of-type) .bp4-input {
    border-top-color: transparent;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }
  > :not(:last-of-type) .bp4-input {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

export function InvoiceSendMailFields() {
  const [showCCField, setShowCCField] = useState<boolean>(false);
  const [showBccField, setShowBccField] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { values, setFieldValue } = useFormikContext();
  const items = useInvoiceMailItems();

  const handleClickCcBtn = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setShowCCField(true);
  };

  const handleClickBccBtn = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setShowBccField(true);
  };

  const handleCreateToItemSelect = (value: SelectOptionProps) => {
    setFieldValue('to', [...values?.to, value?.name]);
  };

  const handleCreateCcItemSelect = (value: SelectOptionProps) => {
    setFieldValue('cc', [...values?.cc, value?.name]);
  };
  const handleCreateBccItemSelect = (value: SelectOptionProps) => {
    setFieldValue('bcc', [...values?.bcc, value?.name]);
  };

  const rightElementsToField = useMemo(() => (
    <Group
      spacing={0}
      paddingRight={'7px'}
      paddingTop={'7px'}
      fontWeight={500}
      color={'#000'}
    >
      <Button
        onClick={handleClickCcBtn}
        minimal
        small
        className={styleEmailButton}
      >
        CC
      </Button>

      <Button
        onClick={handleClickBccBtn}
        minimal
        small
        className={styleEmailButton}
      >
        BCC
      </Button>
    </Group>
  ), []);

  const handleTextareaChange = useCallback((item: SelectOptionProps) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value: text } = textarea;
    const insertText = item.value;
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
  }, [setFieldValue]);

  return (
    <Stack
      bg="white"
      flex={'1'}
      maxHeight="100%"
      spacing={0}
      borderRight="1px solid #dcdcdd"
    >
      <Stack spacing={0} overflow="auto" flex="1" p={'30px'}>
        <FFormGroup label={'To'} name={'to'}>
          <Stack spacing={0} className={fieldsWrapStyle}>
            <FMultiSelect
              items={items}
              name={'to'}
              placeholder={'To'}
              popoverProps={{ minimal: true, fill: true }}
              tagInputProps={{
                tagProps: { round: true, minimal: true, large: true },
                rightElement: rightElementsToField,
                large: true,
              }}
              createNewItemRenderer={createNewItemRenderer}
              createNewItemFromQuery={createNewItemFromQuery}
              onCreateItemSelect={handleCreateToItemSelect}
              resetOnQuery
              resetOnSelect
              fill
              fastField
            />
            {showCCField && (
              <FMultiSelect
                items={items}
                name={'cc'}
                placeholder={'Cc'}
                popoverProps={{ minimal: true, fill: true }}
                tagInputProps={{
                  tagProps: { round: true, minimal: true, large: true },
                  large: true,
                }}
                createNewItemRenderer={createNewItemRenderer}
                createNewItemFromQuery={createNewItemFromQuery}
                onCreateItemSelect={handleCreateCcItemSelect}
                resetOnQuery
                resetOnSelect
                fill
                fastField
              />
            )}
            {showBccField && (
              <FMultiSelect
                items={items}
                name={'bcc'}
                placeholder={'Bcc'}
                popoverProps={{ minimal: true, fill: true }}
                tagInputProps={{
                  tagProps: { round: true, minimal: true, large: true },
                  large: true,
                }}
                createNewItemRenderer={createNewItemRenderer}
                createNewItemFromQuery={createNewItemFromQuery}
                onCreateItemSelect={handleCreateBccItemSelect}
                resetOnQuery
                resetOnSelect
                fill
                fastField
              />
            )}
          </Stack>
        </FFormGroup>

        <FFormGroup label={'Submit'} name={'subject'}>
          <FInputGroup name={'subject'} large fastField />
        </FFormGroup>

        <FFormGroup label={'Message'} name={'message'}>
          <Stack spacing={0}>
            <Group
              border={'1px solid #ced4da'}
              borderBottom={0}
              borderRadius={'3px 3px 0 0'}
            >
              <FSelect
                selectedItem={'customerName'}
                name={'item'}
                items={[{ value: 'CustomerName', text: 'Customer Name' }]}
                onItemChange={handleTextareaChange}
                popoverProps={{
                  fill: false,
                  position: Position.BOTTOM_LEFT,
                  minimal: true,
                }}
                input={({ activeItem, text, label, value }) => (
                  <Button
                    minimal
                    rightIcon={
                      <Icon icon={'caret-down-16'} color={'#8F99A8'} />
                    }
                  >
                    {text}
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
            />
          </Stack>
        </FFormGroup>

        <Group>
          <FCheckbox name={'attachPdf'} label={'Attach PDF'} />
        </Group>
      </Stack>

      <InvoiceSendMailFooter />
    </Stack>
  );
}

function InvoiceSendMailFooter() {
  const { isSubmitting } = useFormikContext();
  const { name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const handleClose = () => {
    closeDrawer(name);
  };

  return (
    <Group
      py={'12px'}
      px={'16px'}
      borderTop="1px solid #d8d8d9"
      position={'apart'}
    >
      <Group spacing={10} ml={'auto'}>
        <Button
          disabled={isSubmitting}
          onClick={handleClose}
          style={{ minWidth: '65px' }}
        >
          Close
        </Button>

        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '85px' }}
          type="submit"
        >
          Send Mail
        </Button>
      </Group>
    </Group>
  );
}
