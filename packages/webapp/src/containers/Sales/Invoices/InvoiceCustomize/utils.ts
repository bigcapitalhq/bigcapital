import { omit } from 'lodash';
import { initialValues } from './constants';
import { InvoiceCustomizeFormValues } from './types';
import { useBrandingTemplateBoot } from '@/containers/BrandingTemplates/BrandingTemplateBoot';
import {
  CreatePdfTemplateValues,
  EditPdfTemplateValues,
} from '@/hooks/query/pdf-templates';
import { transformToForm } from '@/utils';

export const transformToEditRequest = (
  values: InvoiceCustomizeFormValues,
): EditPdfTemplateValues => {
  return {
    templateName: values.templateName,
    attributes: omit(values, ['templateName']),
  };
};

export const transformToNewRequest = (
  values: InvoiceCustomizeFormValues,
): CreatePdfTemplateValues => {
  return {
    resource: 'SaleInvoice',
    templateName: values.templateName,
    attributes: omit(values, ['templateName']),
  };
};

export const useInvoiceCustomizeInitialValues =
  (): InvoiceCustomizeFormValues => {
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
      ) as InvoiceCustomizeFormValues),
    };
  };
