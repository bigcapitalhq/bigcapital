// @ts-nocheck
import { useMemo, useState } from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { SelectOptionProps } from '@blueprintjs-formik/select';
import { useFormikContext } from 'formik';
import { css } from '@emotion/css';
import { FormGroupProps } from '@blueprintjs-formik/core';
import { FFormGroup, FMultiSelect, Group, Stack } from '@/components';
import { SendMailViewFormValues } from './_types';

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

// Create new account renderer.
const createNewItemRenderer = (
  query: string,
  active: boolean,
  handleClick: React.MouseEventHandler<HTMLElement>,
) => {
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
const createNewItemFromQuery = (text: string): SelectOptionProps => ({ text });

interface SendMailViewToAddressFieldProps {
  formGroupProps?: Partial<FormGroupProps>;
  toMultiSelectProps?: Partial<any>;
  fromMultiSelectProps?: Partial<any>;
  ccMultiSelectProps?: Partial<any>;
  bccMultiSelectProps?: Partial<any>;
}

export function SendMailViewToAddressField({
  formGroupProps,
  toMultiSelectProps,
  ccMultiSelectProps,
  bccMultiSelectProps,
}: SendMailViewToAddressFieldProps) {
  const { values, setFieldValue } = useFormikContext<SendMailViewFormValues>();
  const [showCCField, setShowCCField] = useState<boolean>(false);
  const [showBccField, setShowBccField] = useState<boolean>(false);

  const handleClickCcBtn = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setShowCCField(true);
  };

  const handleClickBccBtn = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setShowBccField(true);
  };

  const handleCreateToItemSelect = (value: SelectOptionProps) => {
    setFieldValue('to', [...values?.to, value?.text]);
  };

  const handleCreateCcItemSelect = (value: SelectOptionProps) => {
    setFieldValue('cc', [...values?.cc, value?.text]);
  };

  const handleCreateBccItemSelect = (value: SelectOptionProps) => {
    setFieldValue('bcc', [...values?.bcc, value?.text]);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent the form from submitting when the user presses the Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const rightElementsToField = useMemo(
    () => (
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
    ),
    [],
  );

  return (
    <FFormGroup label={'To'} name={'to'} {...formGroupProps}>
      <Stack spacing={0} className={fieldsWrapStyle}>
        <FMultiSelect
          items={[]}
          name={'to'}
          placeholder={'To'}
          popoverProps={{ minimal: true, fill: true }}
          tagInputProps={{
            tagProps: { round: true, minimal: true, large: true },
            rightElement: rightElementsToField,
            large: true,
            inputProps: {
              onKeyDown: handleTagInputKeyDown,
            },
          }}
          createNewItemRenderer={createNewItemRenderer}
          createNewItemFromQuery={createNewItemFromQuery}
          onCreateItemSelect={handleCreateToItemSelect}
          resetOnQuery
          resetOnSelect
          fill
          fastField
          {...toMultiSelectProps}
        />
        {showCCField && (
          <FMultiSelect
            items={[]}
            name={'cc'}
            placeholder={'Cc'}
            popoverProps={{ minimal: true, fill: true }}
            tagInputProps={{
              tagProps: { round: true, minimal: true, large: true },
              large: true,
              inputProps: {
                onKeyDown: handleTagInputKeyDown,
              },
            }}
            createNewItemRenderer={createNewItemRenderer}
            createNewItemFromQuery={createNewItemFromQuery}
            onCreateItemSelect={handleCreateCcItemSelect}
            resetOnQuery
            resetOnSelect
            fill
            fastField
            {...ccMultiSelectProps}
          />
        )}
        {showBccField && (
          <FMultiSelect
            items={[]}
            name={'bcc'}
            placeholder={'Bcc'}
            popoverProps={{ minimal: true, fill: true }}
            tagInputProps={{
              tagProps: { round: true, minimal: true, large: true },
              large: true,
              inputProps: {
                onKeyDown: handleTagInputKeyDown,
              },
            }}
            createNewItemRenderer={createNewItemRenderer}
            createNewItemFromQuery={createNewItemFromQuery}
            onCreateItemSelect={handleCreateBccItemSelect}
            resetOnQuery
            resetOnSelect
            fill
            fastField
            {...bccMultiSelectProps}
          />
        )}
      </Stack>
    </FFormGroup>
  );
}
