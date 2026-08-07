import { Form } from 'formik';
import { CustomerOpeningBalanceFields } from './CustomerOpeningBalanceFields';
import { CustomerOpeningBalanceFormFloatingActions } from './CustomerOpeningBalanceFormFloatingActions';

/**
 * Customer Opening balance form content.
 */
export function CustomerOpeningBalanceFormContent() {
  return (
    <Form>
      <CustomerOpeningBalanceFields />
      <CustomerOpeningBalanceFormFloatingActions />
    </Form>
  );
}
