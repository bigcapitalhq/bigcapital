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
        <p class="paragraph">
          {intl.getHTML('branch_activate.dialog_paragraph_once_you_enable')}
        </p>

        <ul class="paragraph list">
          <li>
            {intl.get(
              'branch_activate.dialog_paragraph_list_the_current_organization_will_be_considered',
            )}
          </li>
          <li>
            {intl.get(
              'branch_activate.dialog_paragraph_list_all_accounts_transactions_will_be_considered',
            )}
          </li>
        </ul>
      </div>
      <BranchActivateFormFloatingActions />
    </Form>
  );
}
