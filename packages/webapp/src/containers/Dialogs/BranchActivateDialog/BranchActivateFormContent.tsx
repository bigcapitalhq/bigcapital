import React from 'react';
import intl from 'react-intl-universal';
import { Form } from 'formik';
import { Classes } from '@blueprintjs/core';
import BranchActivateFormFloatingActions from './BranchActivateFormFloatingActions';

/**
 * Branch activate form content.
 */
export default function BranchActivateFormContent() {
  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        <p className="paragraph">{intl.getHTML('branch_activate.dialog_paragraph')}</p>

        <ul className="paragraph list">
          <li>{intl.get('branch_activate.dialog_paragraph.line_1')}</li>
          <li>{intl.get('branch_activate.dialog_paragraph.line_2')}</li>
        </ul>
      </div>
      <BranchActivateFormFloatingActions />
    </Form>
  );
}
