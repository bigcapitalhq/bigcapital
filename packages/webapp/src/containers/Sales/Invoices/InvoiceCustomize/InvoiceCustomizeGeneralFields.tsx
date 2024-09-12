// @ts-nocheck
import { Classes, Text } from '@blueprintjs/core';
import {
  FFormGroup,
  FieldRequiredHint,
  FInputGroup,
  FSwitch,
  Group,
  Stack,
} from '@/components';
import { FColorInput } from '@/components/Forms/FColorInput';
import { CreditCardIcon } from '@/icons/CreditCardIcon';
import { Overlay } from './Overlay';
import { useIsTemplateNamedFilled } from './utils';

export function InvoiceCustomizeGeneralField() {
  const isTemplateNameFilled = useIsTemplateNamedFilled();

  return (
    <Stack style={{ padding: 20, flex: '1 1 auto' }}>
      <Stack spacing={0}>
        <h2 style={{ fontSize: 16, marginBottom: 10 }}>General Branding</h2>
        <p className={Classes.TEXT_MUTED}>
          Set your invoice details to be automatically applied every timeyou
          create a new invoice.
        </p>
      </Stack>

      <FFormGroup
        name={'templateName'}
        label={'Template Name'}
        labelInfo={<FieldRequiredHint />}
        fastField
        style={{ marginBottom: 10 }}
      >
        <FInputGroup name={'templateName'} fastField />
      </FFormGroup>

      <Overlay visible={!isTemplateNameFilled}>
        <Stack spacing={0}>
          <FFormGroup
            name={'primaryColor'}
            label={'Primary Color'}
            style={{ justifyContent: 'space-between' }}
            inline
            fastField
          >
            <FColorInput
              name={'primaryColor'}
              inputProps={{ style: { maxWidth: 120 } }}
              fastField
            />
          </FFormGroup>

          <FFormGroup
            name={'secondaryColor'}
            label={'Secondary Color'}
            style={{ justifyContent: 'space-between' }}
            inline
            fastField
          >
            <FColorInput
              name={'secondaryColor'}
              inputProps={{ style: { maxWidth: 120 } }}
              fastField
            />
          </FFormGroup>

          <FFormGroup name={'showCompanyLogo'} label={'Logo'} fastField>
            <FSwitch
              name={'showCompanyLogo'}
              label={'Display company logo in the paper'}
              style={{ fontSize: 14 }}
              large
              fastField
            />
          </FFormGroup>
        </Stack>

        <InvoiceCustomizePaymentManage />
      </Overlay>
    </Stack>
  );
}

function InvoiceCustomizePaymentManage() {
  return (
    <Group
      style={{
        backgroundColor: '#FBFBFB',
        border: '1px solid #E1E1E1',
        padding: 10,
        borderRadius: 5,
      }}
      position={'apart'}
    >
      <Group spacing={10}>
        <CreditCardIcon fill={'#7D8897'} height={16} width={16} />
        <Text>Accept payment methods</Text>
      </Group>

      <a href={'#'}>Manage</a>
    </Group>
  );
}
