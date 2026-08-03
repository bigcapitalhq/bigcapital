import type { ApiFetcher } from './fetch-utils';
import type { paths } from './schema';

export const PDF_TEMPLATES_ROUTES = {
  LIST: '/api/pdf-templates',
  BY_ID: '/api/pdf-templates/{id}',
  STATE: '/api/pdf-templates/state',
  ASSIGN_DEFAULT: '/api/pdf-templates/{id}/assign-default',
} as const satisfies Record<string, keyof paths>;

// Schema does not define request/response content for PDF template operations; use explicit types.
export interface CreatePdfTemplateBody {
  templateName: string;
  resource: string;
  attributes: Record<string, unknown>;
}

export interface EditPdfTemplateBody {
  templateName: string;
  attributes: Record<string, unknown>;
}

export interface PdfTemplateResponse {
  templateName: string;
  companyLogoUri?: string | null;
  attributes: Record<string, unknown>;
  predefined: boolean;
  default: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface PdfTemplatesListResponse {
  templates?: PdfTemplateResponse[];
  [key: string]: unknown;
}

export interface PdfTemplateBrandingStateResponse {
  companyName: string;
  companyAddress: string;
  companyLogoUri: string;
  companyLogoKey: string;
  primaryColor: string;
}

export interface GetPdfTemplatesQuery {
  resource?: string;
}

export async function fetchPdfTemplates(
  fetcher: ApiFetcher,
  query?: GetPdfTemplatesQuery
): Promise<PdfTemplatesListResponse> {
  const get = fetcher.path(PDF_TEMPLATES_ROUTES.LIST).method('get').create();
  const { data } = await (get as (params?: GetPdfTemplatesQuery) => Promise<{ data: PdfTemplatesListResponse }>)(
    query ?? {}
  );
  return data;
}

export async function fetchPdfTemplate(
  fetcher: ApiFetcher,
  id: number
): Promise<PdfTemplateResponse> {
  const get = fetcher.path(PDF_TEMPLATES_ROUTES.BY_ID).method('get').create();
  const { data } = await (get as (params: { id: number }) => Promise<{ data: PdfTemplateResponse }>)({ id });
  return data;
}

export async function createPdfTemplate(
  fetcher: ApiFetcher,
  values: CreatePdfTemplateBody
): Promise<void> {
  const post = fetcher.path(PDF_TEMPLATES_ROUTES.LIST).method('post').create();
  await post(values as never);
}

export async function editPdfTemplate(
  fetcher: ApiFetcher,
  id: number,
  values: EditPdfTemplateBody
): Promise<void> {
  const put = fetcher.path(PDF_TEMPLATES_ROUTES.BY_ID).method('put').create();
  await put({ id, ...values } as never);
}

export async function deletePdfTemplate(fetcher: ApiFetcher, id: number): Promise<void> {
  const del = fetcher.path(PDF_TEMPLATES_ROUTES.BY_ID).method('delete').create();
  await del({ id });
}

export async function assignPdfTemplateAsDefault(
  fetcher: ApiFetcher,
  id: number
): Promise<void> {
  const put = fetcher.path(PDF_TEMPLATES_ROUTES.ASSIGN_DEFAULT).method('put').create();
  await put({ id });
}

export async function fetchPdfTemplateBrandingState(
  fetcher: ApiFetcher
): Promise<PdfTemplateBrandingStateResponse> {
  const get = fetcher.path(PDF_TEMPLATES_ROUTES.STATE).method('get').create();
  const { data } = await (get as (params?: object) => Promise<{ data: PdfTemplateBrandingStateResponse }>)({});
  return data;
}
