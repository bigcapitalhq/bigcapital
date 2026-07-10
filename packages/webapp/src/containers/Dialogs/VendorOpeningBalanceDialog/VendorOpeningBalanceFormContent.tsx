import { Form } from 'formik';
import { VendorOpeningBalanceFormFields } from './VendorOpeningBalanceFormFields';
import { VendorOpeningBalanceFormFloatingActions } from './VendorOpeningBalanceFormFloatingActions';

/**
 * Vendor Opening balance form content.
 */
export function VendorOpeningBalanceFormContent() {
  return (
    <Form>
      <VendorOpeningBalanceFormFields />
      <VendorOpeningBalanceFormFloatingActions />
    </Form>
  );
}
