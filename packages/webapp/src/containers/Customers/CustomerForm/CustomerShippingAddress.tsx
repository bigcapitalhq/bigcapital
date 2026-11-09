import intl from 'react-intl-universal';
import { CustomerFormSectionTitle } from './CustomerFormSectionTitle';
import { Box } from '@/components';
import {
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
  FTextArea,
} from '@/components';

export function CustomerShippingAddress() {
  return (
    <Box data-section-id="shippingAddress">
      <CustomerFormSectionTitle>
        <T id={'shipping_address'} />
      </CustomerFormSectionTitle>
      <FFormGroup
        name={'shippingAddressCountry'}
        label={intl.get('country')}
        inline
      >
        <FInputGroup name={'shippingAddressCountry'} fill />
      </FFormGroup>

      <FFormGroup
        name={'shippingAddress1'}
        label={intl.get('address_line_1')}
        inline
      >
        <FTextArea name={'shippingAddress1'} fill />
      </FFormGroup>

      <FFormGroup
        name={'shippingAddress2'}
        label={intl.get('address_line_2')}
        inline
      >
        <FTextArea name={'shippingAddress2'} fill />
      </FFormGroup>

      <FFormGroup
        name={'shippingAddressCity'}
        label={intl.get('city_town')}
        inline
      >
        <FInputGroup name={'shippingAddressCity'} fill />
      </FFormGroup>

      <FFormGroup
        name={'shippingAddressState'}
        label={intl.get('state')}
        inline
      >
        <FInputGroup name={'shippingAddressState'} fill />
      </FFormGroup>

      <FFormGroup
        name={'shippingAddressPostcode'}
        label={intl.get('zip_code')}
        inline
      >
        <FInputGroup name={'shippingAddressPostcode'} fill />
      </FFormGroup>

      <FFormGroup
        name={'shippingAddressPhone'}
        label={intl.get('phone')}
        inline
      >
        <FInputGroup name={'shippingAddressPhone'} fill />
      </FFormGroup>
    </Box>
  );
}
