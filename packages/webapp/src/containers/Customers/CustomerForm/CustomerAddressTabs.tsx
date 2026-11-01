import { CustomerBillingAddress } from './CustomerBillingAddress';
import { CustomerShippingAddress } from './CustomerShippingAddress';
import { Row } from '@/components';

export function CustomerAddressTabs() {
  return (
    <div className={'tab-panel--address'}>
      <Row>
        <CustomerBillingAddress />
        <CustomerShippingAddress />
      </Row>
    </div>
  );
}
