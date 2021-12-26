
import { useDeepCompareEffect } from 'hooks/utils';

export function FormikObserver({ onChange, values }) {
  useDeepCompareEffect(() => {
    onChange(values);
  }, [values]);

  return null;
}

FormikObserver.defaultProps = {
  onChange: () => null,
};
