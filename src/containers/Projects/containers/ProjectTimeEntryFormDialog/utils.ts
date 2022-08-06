import React from 'react';
import { useFormikContext } from 'formik';
import { useProjectTimeEntryFormContext } from './ProjectTimeEntryFormProvider';

export const useSetProjectToForm = () => {
  const { values } = useFormikContext();
  const { setProjectPayload } = useProjectTimeEntryFormContext();

  React.useEffect(() => {
    if (values.project_id) {
      setProjectPayload(values.project_id);
    }
  }, [values.projectId]);
};
