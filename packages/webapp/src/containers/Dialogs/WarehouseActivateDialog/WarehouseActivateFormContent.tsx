import { Classes } from '@blueprintjs/core';
import { Form } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { WarehouseActivateFormFloatingActions } from './WarehouseActivateFormFloatingActions';

export function WarehouseActivateFormContent(): React.ReactElement {
  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        <p
          className="paragraph"
          dangerouslySetInnerHTML={{
            __html: intl.getHTML('warehouse_activate.dialog_paragraph'),
          }}
        />

        <ul className="paragraph list">
          <li>{intl.get('warehouse_activate.dialog_paragraph.line_1')}</li>
          <li>{intl.get('warehouse_activate.dialog_paragraph.line_2')}</li>
        </ul>
      </div>
      <WarehouseActivateFormFloatingActions />
    </Form>
  );
}
