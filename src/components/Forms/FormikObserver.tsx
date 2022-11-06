// @ts-nocheck
import { useFormikContext } from 'formik';
import { useDeepCompareEffect } from '@/hooks/utils';

export function FormikObserver({ onChange }) {
  const { values } = useFormikContext();

  useDeepCompareEffect(() => {
    onChange(values);
  }, [values]);

  return null;
}

FormikObserver.defaultProps = {
  onChange: () => null,
};
