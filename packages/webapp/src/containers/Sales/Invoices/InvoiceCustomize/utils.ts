import { omit } from 'lodash';
import { useFormikContext } from 'formik';
import { InvoiceCustomizeValues } from './types';
import {
  CreatePdfTemplateValues,
  EditPdfTemplateValues,
} from '@/hooks/query/pdf-templates';
import { transformToForm } from '@/utils';
import { initialValues } from './constants';
import { useBrandingTemplateBoot } from '@/containers/BrandingTemplates/BrandingTemplateBoot';

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
