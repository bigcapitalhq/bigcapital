import React from 'react';
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
        <p class="paragraph">
          Once you enable <strong>Multiply Branches</strong>, you will not be able to disable it.
          However, you can delete the branch or mark it inactive.
        </p>

        <ul class="paragraph list">
          <li>
            The current organization will be considered as the Head Office or
            Primary Branch.
          </li>
          <li>
            All accounts transactions will be considered as the primary office.
          </li>
        </ul>
      </div>
      <BranchActivateFormFloatingActions />
    </Form>
  );
}
