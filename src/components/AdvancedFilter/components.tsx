// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { debounce } from 'lodash';

const DEBOUNCE_MS = 100;

/**
 * Advanced filter auto-save.
 */
export function useAdvancedFilterAutoSubmit() {
  const { submitForm, values } = useFormikContext();
  const [isSubmit, setIsSubmit] = React.useState(false);

  const debouncedSubmit = React.useCallback(
    debounce(() => {
      return submitForm().then(() => setIsSubmit(true));
    }, DEBOUNCE_MS),
    [submitForm],
  );

  React.useEffect(() => debouncedSubmit, [debouncedSubmit, values]);
}
