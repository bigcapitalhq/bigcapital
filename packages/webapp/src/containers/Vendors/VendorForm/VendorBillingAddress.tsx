import intl from 'react-intl-universal';
import { VendorFormSectionTitle } from './VendorFormSectionTitle';
import { Box } from '@/components';
import {
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
  FTextArea,
} from '@/components';

export function VendorBillingAddress() {
  return (
    <Box data-section-id="billingAddress">
      <VendorFormSectionTitle>
        <T id={'billing_address'} />
      </VendorFormSectionTitle>
      <FFormGroup
        name={'billingAddressCountry'}
        label={intl.get('country')}
        inline
        fastField
      >
        <FInputGroup name={'billingAddressCountry'} fill fastField />
      </FFormGroup>

      <FFormGroup
        name={'billingAddress1'}
        label={intl.get('address_line_1')}
        inline
        fastField
      >
        <FTextArea name={'billingAddress1'} fill fastField />
      </FFormGroup>

      <FFormGroup
        name={'billingAddress2'}
        label={intl.get('address_line_2')}
        inline
        fastField
      >
        <FTextArea name={'billingAddress2'} fill fastField />
      </FFormGroup>

      <FFormGroup
        name={'billingAddressCity'}
        label={intl.get('city_town')}
        inline
        fastField
      >
        <FInputGroup name={'billingAddressCity'} fill fastField />
      </FFormGroup>

      <FFormGroup
        name={'billingAddressState'}
        label={intl.get('state')}
        inline
        fastField
      >
        <FInputGroup name={'billingAddressState'} fill fastField />
      </FFormGroup>

      <FFormGroup
        name={'billingAddressPostcode'}
        label={intl.get('zip_code')}
        inline
        fastField
      >
        <FInputGroup name={'billingAddressPostcode'} fill fastField />
      </FFormGroup>

      <FFormGroup
        name={'billingAddressPhone'}
        label={intl.get('phone')}
        inline
        fastField
      >
        <FInputGroup name={'billingAddressPhone'} fill fastField />
      </FFormGroup>
    </Box>
  );
}
