import { omit } from 'lodash';
import { useFormikContext } from 'formik';
import { InvoiceCustomizeValues } from './types';
import {
  CreatePdfTemplateValues,
  EditPdfTemplateValues,
} from '@/hooks/query/pdf-templates';
import { useBrandingTemplateBoot } from '../BrandingTemplates/BrandingTemplateBoot';
import { transformToForm } from '@/utils';
import { initialValues } from './constants';

export const transformToEditRequest = (
  values: InvoiceCustomizeValues,
): EditPdfTemplateValues => {
  return {
    templateName: values.templateName,
    attributes: omit(values, ['templateName']),
  };
};

export const transformToNewRequest = (
  values: InvoiceCustomizeValues,
): CreatePdfTemplateValues => {
  return {
    resource: 'SaleInvoice',
    templateName: values.templateName,
    attributes: omit(values, ['templateName']),
  };
};

export const useIsTemplateNamedFilled = () => {
  const { values } = useFormikContext<InvoiceCustomizeValues>();

  return values.templateName && values.templateName?.length >= 4;
};

export const useInvoiceCustomizeInitialValues = (): InvoiceCustomizeValues => {
  const { pdfTemplate } = useBrandingTemplateBoot();

  const defaultPdfTemplate = {
    templateName: pdfTemplate?.templateName,
    ...pdfTemplate?.attributes,
  };
  return {
    ...initialValues,
    ...(transformToForm(
      defaultPdfTemplate,
      initialValues,
    ) as InvoiceCustomizeValues),
  };
};
