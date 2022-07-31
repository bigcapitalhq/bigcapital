import React from 'react';
import { useFormikContext } from 'formik';
import { useProjectTimeEntryFormContext } from './ProjectTimeEntryFormProvider';

export const useSetProjectToForm = () => {
  const { values } = useFormikContext();
  const { setProjectPayload, isProjectsSuccess } =
    useProjectTimeEntryFormContext();

  React.useEffect(() => {
    if (isProjectsSuccess) {
      setProjectPayload(values.projectId);
    }
  }, [values.projectId]);
};
