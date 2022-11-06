// @ts-nocheck
import React from 'react';
import { Form } from 'formik';

import VendorOpeningBalanceFormFields from './VendorOpeningBalanceFormFields';
import VendorOpeningBalanceFormFloatingActions from './VendorOpeningBalanceFormFloatingActions';

/**
 * Vendor Opening balance form content.
 * @returns
 */
function VendorOpeningBalanceFormContent() {
  return (
    <Form>
      <VendorOpeningBalanceFormFields />
      <VendorOpeningBalanceFormFloatingActions />
    </Form>
  );
}

export default VendorOpeningBalanceFormContent;
