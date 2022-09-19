// @ts-nocheck
import React from 'react';
import { isNull } from 'lodash';
import { useFormikContext } from 'formik';
import { useProjectTimeEntryFormContext } from './ProjectTimeEntryFormProvider';

export const useSetProjectToForm = () => {
  const { values } = useFormikContext();
  const { setProjectPayload, projectId } = useProjectTimeEntryFormContext();

  React.useEffect(() => {
    if (isNull(projectId)) {
      setProjectPayload(values.project_id);
    }
  }, [values.project_id]);
};
