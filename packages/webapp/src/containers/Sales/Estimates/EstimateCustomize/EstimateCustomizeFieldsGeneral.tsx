// @ts-nocheck
import { Classes, Text } from '@blueprintjs/core';
import {
  FFormGroup,
  FInputGroup,
  FSwitch,
  FieldRequiredHint,
  Group,
  Stack,
} from '@/components';
import { FColorInput } from '@/components/Forms/FColorInput';
// import styles from './InvoiceCustomizeFields.module.scss';

export function EstimateCustomizeGeneralField() {
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
    </Stack>
  );
}
