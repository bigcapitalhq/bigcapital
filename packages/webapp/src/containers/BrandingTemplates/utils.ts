import { useFormikContext } from 'formik';
import { BrandingTemplateValues } from './types';

export const useIsTemplateNamedFilled = () => {
  const { values } = useFormikContext<BrandingTemplateValues>();

  return values.templateName && values.templateName?.length >= 4;
};
