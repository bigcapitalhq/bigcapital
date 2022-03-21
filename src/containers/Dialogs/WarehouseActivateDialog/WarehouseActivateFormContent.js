import React from 'react';
import { Form } from 'formik';
import { Classes } from '@blueprintjs/core';

import WarehouseActivateFormFloatingActions from './WarehouseActivateFormFloatingActions';

/**
 * Warehouse activate form content.
 */
export default function WarehouseActivateFormContent() {
  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        <p class="paragraph">
          Once you enable <strong>Multiply Warehouses</strong>, you will not be able to disable it.
          However, you can delete the warehouse or mark it inactive.
        </p>

        <ul class="paragraph list">
          <li>
            The current organization will be considered as the Primary Warehouse.
          </li>
          <li>
            All inventory transactions will be considered as the Primary Warehouse.
          </li>
        </ul>
      </div>
      <WarehouseActivateFormFloatingActions />
    </Form>
  );
}
