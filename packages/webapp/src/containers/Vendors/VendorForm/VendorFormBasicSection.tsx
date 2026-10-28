import {
  ControlGroup,
  Divider,
  Icon as BlueprintIcon,
} from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { useVendorFormContext } from './VendorFormProvider';
import { VendorFormSectionTitle } from './VendorFormSectionTitle';
import {
  SalutationList,
  SalutationItem,
  DisplayNameList,
  useDisplayNameSynchronizer,
  FInputGroup,
  FFormGroup,
  Box,
  Icon,
  Stack,
} from '@/components';
import { useAutofocus } from '@/hooks';
import { useSettingsVendors } from '@/hooks/query';
import { transactionNumber } from '@/utils';

export function VendorFormBasicSection() {
  const firstNameFieldRef = useAutofocus<HTMLInputElement>();
  const { syncDisplayName, createFieldOnChange } = useDisplayNameSynchronizer();
  const { isNewMode } = useVendorFormContext();
  const { data: vendorSettings } = useSettingsVendors();

  const autoIncrement = Boolean(vendorSettings?.autoIncrement);
  const nextCode = transactionNumber(
    vendorSettings?.numberPrefix as string | undefined,
    vendorSettings?.nextNumber as string | number | undefined,
  );
  const showAutoCode = isNewMode && autoIncrement && Boolean(nextCode);
  const codeHelperText = showAutoCode
    ? intl.get('vendor_code_auto_increment_hint', { code: nextCode })
    : 'Add a unique account number to identify, reference and search for the contact.';

  return (
    <Box data-section-id="primary">
      <VendorFormSectionTitle>Vendor details</VendorFormSectionTitle>

      {/**----------- Contact name -----------*/}
      <FFormGroup
        name={'salutation'}
        label={intl.get('contact_name')}
        inline
        fastField
      >
        <ControlGroup fill>
          <SalutationList
            name={'salutation'}
            popoverProps={{ minimal: true }}
            fastField
            onItemChange={(item: SalutationItem) =>
              syncDisplayName({ salutation: item.key })
            }
          />
          <FInputGroup
            name={'firstName'}
            placeholder={intl.get('first_name')}
            inputRef={(ref: HTMLInputElement | null) => {
              if (ref) firstNameFieldRef.current = ref;
            }}
            data-testId={'vendor-first-name-input'}
            onChange={createFieldOnChange('firstName')}
            fill
            fastField
          />
          <FInputGroup
            name={'lastName'}
            placeholder={intl.get('last_name')}
            data-testId={'vendor-last-name-input'}
            onChange={createFieldOnChange('lastName')}
            fill
            fastField
          />
        </ControlGroup>
      </FFormGroup>

      <FFormGroup
        name={'code'}
        label={'Vendor Code'}
        helperText={codeHelperText}
        inline
        fastField
      >
        <FInputGroup
          name={'code'}
          data-testId={'vendor-code-input'}
          placeholder={showAutoCode ? nextCode : undefined}
          fill
          fastField
        />
      </FFormGroup>

      {/*----------- Company Name -----------*/}
      <FFormGroup
        name={'companyName'}
        label={intl.get('company_name')}
        inline
        fastField
      >
        <FInputGroup
          name={'companyName'}
          data-testId={'vendor-company-name-input'}
          onChange={createFieldOnChange('companyName')}
          fill
          fastField
        />
      </FFormGroup>

      {/*----------- Display Name -----------*/}
      <FFormGroup
        name={'displayName'}
        label={intl.get('display_name')}
        helperText="This is the name that appears on invoices and emails."
        inline
        fastField
      >
        <DisplayNameList
          name={'displayName'}
          popoverProps={{ minimal: true }}
          buttonProps={{
            fill: true,
            'data-testId': 'vendor-display-name-select',
          }}
        />
      </FFormGroup>

      <Divider style={{ margin: '20px 0' }} />

      {/*------------ Vendor email -----------*/}
      <FFormGroup
        name={'email'}
        label={intl.get('vendor_email')}
        inline
        fastField
      >
        <FInputGroup
          name={'email'}
          leftIcon={<Icon icon="envelope" />}
          fastField
        />
      </FFormGroup>

      {/*------------ Phone number -----------*/}
      <FFormGroup
        name={'workPhone'}
        className={'form-group--phone-number'}
        label={intl.get('phone_number')}
        inline
        fastField
      >
        <Stack spacing={10}>
          <FInputGroup
            name={'workPhone'}
            placeholder={intl.get('work')}
            leftIcon="phone"
            fastField
          />
          <FInputGroup
            name={'personalPhone'}
            placeholder={intl.get('mobile')}
            fastField
          />
        </Stack>
      </FFormGroup>

      {/*------------ Vendor website -----------*/}
      <FFormGroup name={'website'} label={intl.get('website')} inline fastField>
        <FInputGroup
          name={'website'}
          placeholder={'http://'}
          leftIcon={<BlueprintIcon icon="globe-network" />}
          fastField
        />
      </FFormGroup>
    </Box>
  );
}
