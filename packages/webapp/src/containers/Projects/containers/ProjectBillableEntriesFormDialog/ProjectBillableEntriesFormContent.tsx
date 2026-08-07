// @ts-nocheck

import { Form } from 'formik';
import React from 'react';
import { ProjectBillableEntriesFormFields } from './ProjectBillableEntriesFormFields';
import { ProjectBillableEntriesFormFloatingActions } from './ProjectBillableEntriesFormFloatingActions';
import { useProjectBillableEntriesFormContext } from './ProjectBillableEntriesFormProvider';
import { EmptyStatuCallout } from './utils';
import { Choose } from '@/components';

/**
 * Project billable entries form content.
 * @returns
 */
export function ProjectBillableEntriesFormContent() {
  const { isEmptyStatus } = useProjectBillableEntriesFormContext();
  return (
    <Choose>
      <Choose.When condition={isEmptyStatus}>
        <EmptyStatuCallout />
      </Choose.When>
      <Choose.Otherwise>
        <Form>
          <ProjectBillableEntriesFormFields />
          <ProjectBillableEntriesFormFloatingActions />
        </Form>
      </Choose.Otherwise>
    </Choose>
  );
}
