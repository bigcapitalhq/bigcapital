import intl from 'react-intl-universal';
import { VendorFormSectionTitle } from './VendorFormSectionTitle';
import { Box } from '@/components';
import {
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
  FTextArea,
} from '@/components';

export function VendorShippingAddress() {
  return (
    <Box data-section-id="shippingAddress">
      <VendorFormSectionTitle>
        <T id={'shipping_address'} />
      </VendorFormSectionTitle>
      <FFormGroup
        name={'shippingAddressCountry'}
        label={intl.get('country')}
        inline
        fastField
      >
        <FInputGroup name={'shippingAddressCountry'} fill fastField />
      </FFormGroup>

      <FFormGroup
        name={'shippingAddress1'}
        label={intl.get('address_line_1')}
        inline
        fastField
      >
        <FTextArea name={'shippingAddress1'} fill fastField />
      </FFormGroup>

      <FFormGroup
        name={'shippingAddress2'}
        label={intl.get('address_line_2')}
        inline
        fastField
      >
        <FTextArea name={'shippingAddress2'} fill fastField />
      </FFormGroup>

      <FFormGroup
        name={'shippingAddressCity'}
        label={intl.get('city_town')}
        inline
        fastField
      >
        <FInputGroup name={'shippingAddressCity'} fill fastField />
      </FFormGroup>

      <FFormGroup
        name={'shippingAddressState'}
        label={intl.get('state')}
        inline
        fastField
      >
        <FInputGroup name={'shippingAddressState'} fill fastField />
      </FFormGroup>

      <FFormGroup
        name={'shippingAddressPostcode'}
        label={intl.get('zip_code')}
        inline
        fastField
      >
        <FInputGroup name={'shippingAddressPostcode'} fill fastField />
      </FFormGroup>

      <FFormGroup
        name={'shippingAddressPhone'}
        label={intl.get('phone')}
        inline
        fastField
      >
        <FInputGroup name={'shippingAddressPhone'} fill fastField />
      </FFormGroup>
    </Box>
  );
}
