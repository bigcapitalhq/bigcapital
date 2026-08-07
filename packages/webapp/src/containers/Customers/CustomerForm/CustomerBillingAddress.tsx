import intl from 'react-intl-universal';
import { CustomerFormSectionTitle } from './CustomerFormSectionTitle';
import { Box } from '@/components';
import {
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
  FTextArea,
} from '@/components';

export function CustomerBillingAddress() {
  return (
    <Box data-section-id="billingAddress">
      <CustomerFormSectionTitle>
        <T id={'billing_address'} />
      </CustomerFormSectionTitle>
      <FFormGroup
        name={'billingAddressCountry'}
        label={intl.get('country')}
        inline
      >
        <FInputGroup name={'billingAddressCountry'} fill />
      </FFormGroup>

      <FFormGroup
        name={'billingAddress1'}
        label={intl.get('address_line_1')}
        inline
      >
        <FTextArea name={'billingAddress1'} fill />
      </FFormGroup>

      <FFormGroup
        name={'billingAddress2'}
        label={intl.get('address_line_2')}
        inline
      >
        <FTextArea name={'billingAddress2'} fill />
      </FFormGroup>

      <FFormGroup
        name={'billingAddressCity'}
        label={intl.get('city_town')}
        inline
      >
        <FInputGroup name={'billingAddressCity'} fill />
      </FFormGroup>

      <FFormGroup name={'billingAddressState'} label={intl.get('state')} inline>
        <FInputGroup name={'billingAddressState'} fill />
      </FFormGroup>

      <FFormGroup
        name={'billingAddressPostcode'}
        label={intl.get('zip_code')}
        inline
      >
        <FInputGroup name={'billingAddressPostcode'} fill />
      </FFormGroup>

      <FFormGroup name={'billingAddressPhone'} label={intl.get('phone')} inline>
        <FInputGroup name={'billingAddressPhone'} fill />
      </FFormGroup>
    </Box>
  );
}
