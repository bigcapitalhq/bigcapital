import type { ApiFetcher } from './fetch-utils';
import { withFormData } from './fetch-utils';
import { paths } from './schema';

export const IMPORT_ROUTES = {
  FILE: '/api/import/file',
  MAPPING: '/api/import/{import_id}/mapping',
  PREVIEW: '/api/import/{import_id}/preview',
  IMPORT: '/api/import/{import_id}/import',
  SAMPLE: '/api/import/sample',
  META: '/api/import/{import_id}',
} as const satisfies Record<string, keyof paths>;

export interface ImportMappingBody {
  mapping: Array<{ group?: string; from: string; to: string }>;
}

export interface ImportPreviewResponse {
  [key: string]: unknown;
}

export interface ImportFileMetaResponse {
  [key: string]: unknown;
}

export interface ImportProcessResponse {
  resource?: string;
  [key: string]: unknown;
}

export interface ImportFileUploadResource {
  importId: string;
  resource: string;
}

export interface ImportFileUploadResourceColumn {
  key: string;
  name: string;
  required?: boolean;
  hint?: string;
}

export interface ImportFileUploadResponse {
  import: ImportFileUploadResource;
  sheetColumns: string[];
  resourceColumns: ImportFileUploadResourceColumn[];
}

export interface ImportSampleParams {
  resource: string;
  format: 'csv' | 'xlsx';
}

export async function fetchImportPreview(
  fetcher: ApiFetcher,
  importId: string
): Promise<ImportPreviewResponse> {
  const get = fetcher
    .path(IMPORT_ROUTES.PREVIEW)
    .method('get')
    .create();
  const { data } = await get({ import_id: importId } as never);
  return (data ?? {}) as ImportPreviewResponse;
}

export async function fetchImportFileMeta(
  fetcher: ApiFetcher,
  importId: string
): Promise<ImportFileMetaResponse> {
  const get = fetcher.path(IMPORT_ROUTES.META).method('get').create();
  const { data } = await get({ import_id: importId } as never);
  return (data ?? {}) as ImportFileMetaResponse;
}

export async function importMapping(
  fetcher: ApiFetcher,
  importId: string,
  body: ImportMappingBody
): Promise<void> {
  const post = fetcher
    .path(IMPORT_ROUTES.MAPPING)
    .method('post')
    .create();
  await post({ import_id: importId, ...body } as never);
}

export async function importProcess(
  fetcher: ApiFetcher,
  importId: string
): Promise<ImportProcessResponse> {
  const post = fetcher.path(IMPORT_ROUTES.IMPORT).method('post').create();
  const { data } = await post({ import_id: importId } as never);
  return (data ?? {}) as ImportProcessResponse;
}

/**
 * Upload an import file via multipart/form-data. The generated typed fetcher's
 * JSON body serializer would corrupt a `FormData` instance, so the body is
 * smuggled through a custom init property (`withFormData`) that the form-data
 * middleware swaps back in as the real body before fetch executes. This keeps
 * the upload on the full middleware pipeline: the camelCase middleware
 * transforms the response so callers receive camelCase keys, and failures
 * throw an `ApiError` with `data.errors` (same shape as JSON endpoints).
 */
export async function uploadImportFile(
  fetcher: ApiFetcher,
  formData: FormData
): Promise<ImportFileUploadResponse> {
  const post = fetcher.path(IMPORT_ROUTES.FILE).method('post').create();
  const { data } = await post({} as never, withFormData(formData));
  return (data ?? {}) as ImportFileUploadResponse;
}

/**
 * Download a csv/xlsx sample sheet as a binary Blob. The raw-response
 * middleware intercepts the binary `Accept` header (e.g. `application/xlsx`)
 * and returns the body as a Blob; CSV responses come back as text from the
 * default fetcher and are wrapped in a Blob here for a consistent return type.
 */
export async function downloadImportSample(
  fetcher: ApiFetcher,
  params: ImportSampleParams
): Promise<Blob> {
  const get = fetcher.path(IMPORT_ROUTES.SAMPLE).method('get').create();
  const response = await get(
    { resource: params.resource, format: params.format } as never,
    {
      headers: {
        Accept: params.format === 'xlsx' ? 'application/xlsx' : 'application/csv',
      },
    },
  );
  const data = response.data as Blob | string;
  return data instanceof Blob ? data : new Blob([data]);
}
