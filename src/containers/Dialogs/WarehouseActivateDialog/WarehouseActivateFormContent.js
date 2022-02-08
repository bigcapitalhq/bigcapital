import React from 'react';
import { Form } from 'formik';
import { Intent, Callout, Classes } from '@blueprintjs/core';

import WarehouseActivateFormFloatingActions from './WarehouseActivateFormFloatingActions';

/**
 * warehouse activate form content.
 */
export default function WarehouseActivateFormContent() {
  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        <Callout icon={null} intent={Intent.PRIMARY}>
          Aute esse eiusmod dolore ipsum dolor sint qui proident pariatur
          proident fugiat ea ad aliquip.
        </Callout>
      </div>
      <WarehouseActivateFormFloatingActions />
    </Form>
  );
}
