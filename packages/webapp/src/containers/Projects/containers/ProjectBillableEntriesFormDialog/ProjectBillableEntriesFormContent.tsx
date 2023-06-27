// @ts-nocheck

import React from 'react';
import { Form } from 'formik';
import { Choose } from '@/components';
import { EmptyStatusCallout } from './utils';
import { useProjectBillableEntriesFormContext } from './ProjectBillableEntriesFormProvider';
import ProjectBillableEntriesFormFields from './ProjectBillableEntriesFormFields';
import ProjectBillableEntriesFormFloatingActions from './ProjectBillableEntriesFormFloatingActions';

/**
 * Project billable entries form content.
 * @returns
 */
export default function ProjectBillableEntriesFormContent() {
  const { isEmptyStatus } = useProjectBillableEntriesFormContext();
  return (
    <Choose>
      <Choose.When condition={isEmptyStatus}>
        <EmptyStatusCallout />
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
