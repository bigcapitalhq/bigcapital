// @ts-nocheck
import { Button, Intent, MenuItem } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import {
  FFormGroup,
  FInputGroup,
  FMultiSelect,
  Group,
  Stack,
} from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useDrawerActions } from '@/hooks/state';

const commonAddressSelect = {
  placeholder: '',
  labelAccessor: '',
  valueAccessor: 'mail',

  tagAccessor: (item) => `<${item.label}> (${item.mail})`,
  textAccessor: (item) => `<${item.label}> (${item.mail})`,
};

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
  const allowCreate = true;
  // Maybe inject new item props to select component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : null;

  return (
    <Stack
      bg="white"
      flex={'1'}
      maxHeight="100%"
      spacing={0}
      borderRight="1px solid #dcdcdd"
    >
      <Stack overflow="auto" flex="1" p={'30px'}>
        <FFormGroup label={'to'} name={'To'}>
          <Stack spacing={0}>
            <FMultiSelect
              items={[]}
              name={'to'}
              popoverProps={{ minimal: true, fill: true }}
              tagInputProps={{
                tagProps: { round: true, minimal: true, large: true },
                large: true,
                rightElement: (
                  <Group>
                    <a href="#">CC</a>
                    <a href="#">BCC</a>
                  </Group>
                ),
              }}
              fill={true}
              createNewItemRenderer={maybeCreateNewItemRenderer}
              createNewItemFromQuery={maybeCreateNewItemFromQuery}
              {...commonAddressSelect}
            />
            <FMultiSelect
              items={[]}
              name={'cc'}
              popoverProps={{ minimal: true, fill: true }}
              tagInputProps={{
                tagProps: { round: true, minimal: true, large: true },
                large: true,
              }}
              fill={true}
              createNewItemRenderer={maybeCreateNewItemRenderer}
              createNewItemFromQuery={maybeCreateNewItemFromQuery}
              {...commonAddressSelect}
            />
            <FMultiSelect
              items={[]}
              name={'bcc'}
              popoverProps={{ minimal: true, fill: true }}
              tagInputProps={{
                tagProps: { round: true, minimal: true, large: true },
                large: true,
              }}
              fill={true}
              createNewItemRenderer={maybeCreateNewItemRenderer}
              createNewItemFromQuery={maybeCreateNewItemFromQuery}
              {...commonAddressSelect}
            />
          </Stack>
        </FFormGroup>

        <FFormGroup label={'Submit'} name={'subject'}>
          <FInputGroup name={'subject'} large />
        </FFormGroup>

        <FFormGroup label={'Message'} name={'message'}>
          <FInputGroup name={'message'} large />
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
