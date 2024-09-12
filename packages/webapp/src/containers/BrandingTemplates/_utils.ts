import { omit } from 'lodash';
import {
  CreatePdfTemplateValues,
  EditPdfTemplateValues,
} from '@/hooks/query/pdf-templates';
import { useBrandingTemplateBoot } from './BrandingTemplateBoot';
import { transformToForm } from '@/utils';
import { BrandingTemplateValues } from './types';
import { useFormikContext } from 'formik';

export const transformToEditRequest = <T extends BrandingTemplateValues>(
  values: T,
): EditPdfTemplateValues => {
  return {
    templateName: values.templateName,
    attributes: omit(values, ['templateName']),
  };
};

export const transformToNewRequest = <T extends BrandingTemplateValues>(
  values: T,
  resource: string
): CreatePdfTemplateValues => {
  return {
    resource,
    templateName: values.templateName,
    attributes: omit(values, ['templateName']),
  };
};

export const useIsTemplateNamedFilled = () => {
  const { values } = useFormikContext<BrandingTemplateValues>();

  return values.templateName && values.templateName?.length >= 4;
};

export const useBrandingTemplateFormInitialValues = <
  T extends BrandingTemplateValues,
>(
  initialValues = {},
) => {
  const { pdfTemplate } = useBrandingTemplateBoot();

  const defaultPdfTemplate = {
    templateName: pdfTemplate?.templateName,
    ...pdfTemplate?.attributes,
  };
  return {
    ...initialValues,
    ...(transformToForm(defaultPdfTemplate, initialValues) as T),
  };
};
