// @ts-nocheck
import { useState } from 'react';
import { Button, Intent, MenuItem } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { css } from '@emotion/css';
import { x } from '@xstyled/emotion';
import { unique, chain } from 'lodash';
import {
  FFormGroup,
  FInputGroup,
  FMultiSelect,
  FTextArea,
  Group,
  Stack,
} from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';
import { SelectOptionProps } from '@blueprintjs-formik/select';

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

export function InvoiceSendMailFields() {
  const [showCCField, setShowCCField] = useState<boolean>(false);
  const [showBccField, setShowBccField] = useState<boolean>(false);

  const { values, setFieldValue } = useFormikContext();

  const items = chain([...values?.to, ...values?.cc, ...values?.bcc])
    .filter((email) => !!email?.trim())
    .uniq()
    .map((email) => ({
      value: email,
      text: email,
    }))
    .value();

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
    const _value = [...values?.to, value?.name];
    setFieldValue('to', _value);
  };

  const handleCreateCcItemSelect = (value: SelectOptionProps) => {
    const _value = [...values?.cc, value?.name];
    setFieldValue('cc', _value);
  };
  const handleCreateBccItemSelect = (value: SelectOptionProps) => {
    const _value = [...values?.bcc, value?.name];
    setFieldValue('bcc', _value);
  };

  return (
    <Stack
      bg="white"
      flex={'1'}
      maxHeight="100%"
      spacing={0}
      borderRight="1px solid #dcdcdd"
    >
      <Stack spacing={0} overflow="auto" flex="1" p={'30px'} className={css`
        
        `}>
        <FFormGroup label={'To'} name={'to'}>
          <Stack spacing={0} className={css`
              > :not(:first-of-type) .bp4-input{
                border-top-color: transparent;
                border-top-right-radius: 0;
                border-top-left-radius: 0;
              }
              > :not(:last-of-type) .bp4-input {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
              }
            `}>
            <FMultiSelect
              items={items}
              name={'to'}
              placeholder={''}
              popoverProps={{ minimal: true, fill: true }}
              tagInputProps={{
                tagProps: { round: true, minimal: true, large: true },
                large: true,
                rightElement: (
                  <Group
                    spacing={10}
                    paddingRight={12}
                    fontWeight={500}
                    color={'#000'}
                  >
                    <x.a
                      href="#"
                      onClick={handleClickCcBtn}
                      color="#404854"
                      fontSize={'12px'}
                      className={css`
                        &:hover {
                          text-decoration: none;
                        }
                      `}
                    >
                      CC
                    </x.a>

                    <x.a
                      href="#"
                      onClick={handleClickBccBtn}
                      color="#404854"
                      fontSize={'12px'}
                      className={css`
                        &:hover {
                          text-decoration: none;
                        }
                      `}
                    >
                      BCC
                    </x.a>
                  </Group>
                ),
              }}
              createNewItemRenderer={createNewItemRenderer}
              createNewItemFromQuery={createNewItemFromQuery}
              onCreateItemSelect={handleCreateToItemSelect}
              resetOnQuery
              resetOnSelect
              fill
            />
            {showCCField && (
              <FMultiSelect
                items={items}
                name={'cc'}
                placeholder={''}
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
              />
            )}
            {showBccField && (
              <FMultiSelect
                items={items}
                name={'bcc'}
                placeholder={''}
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
              />
            )}
          </Stack>
        </FFormGroup>

        <FFormGroup label={'Submit'} name={'subject'}>
          <FInputGroup name={'subject'} large />
        </FFormGroup>

        <FFormGroup label={'Message'} name={'message'}>
          <FTextArea
            name={'message'}
            large
            fill
            className={css`
              resize: vertical;
              min-height: 200px;
            `}
          />
        </FFormGroup>
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
