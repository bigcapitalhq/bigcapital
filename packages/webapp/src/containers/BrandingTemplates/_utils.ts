import { omit } from 'lodash';
import * as R from 'ramda';
import {
  CreatePdfTemplateValues,
  EditPdfTemplateValues,
} from '@/hooks/query/pdf-templates';
import { useBrandingTemplateBoot } from './BrandingTemplateBoot';
import { transformToForm } from '@/utils';
import { BrandingTemplateValues } from './types';
import { useFormikContext } from 'formik';
import { DRAWERS } from '@/constants/drawers';

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
  resource: string,
): CreatePdfTemplateValues => {
  return {
    resource,
    templateName: values.templateName,
    attributes: omit(values, ['templateName']),
  };
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

export const getCustomizeDrawerNameFromResource = (resource: string) => {
  const pairs = {
    SaleInvoice: DRAWERS.INVOICE_CUSTOMIZE,
    SaleEstimate: DRAWERS.ESTIMATE_CUSTOMIZE,
    SaleReceipt: DRAWERS.RECEIPT_CUSTOMIZE,
    CreditNote: DRAWERS.CREDIT_NOTE_CUSTOMIZE,
    PaymentReceive: DRAWERS.PAYMENT_RECEIVED_CUSTOMIZE,
  };
  return R.prop(resource, pairs) || DRAWERS.INVOICE_CUSTOMIZE;
};

export const getButtonLabelFromResource = (resource: string) => {
  const pairs = {
    SaleInvoice: 'Create Invoice Branding',
    SaleEstimate: 'Create Estimate Branding',
    SaleReceipt: 'Create Receipt Branding',
    CreditNote: 'Create Credit Note Branding',
    PaymentReceive: 'Create Payment Branding',
  };
  return R.prop(resource, pairs) || 'Create Branding Template'; 
}