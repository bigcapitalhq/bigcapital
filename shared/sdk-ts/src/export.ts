import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';

export const EXPORT_ROUTES = {
  RESOURCE: '/api/export',
} as const satisfies Record<string, keyof paths>;

export interface ExportResourceParams {
  resource: string;
  format: 'csv' | 'xlsx' | 'pdf';
}

export type ExportResourceResponse = Blob;

/**
 * Download an exported resource (csv/xlsx/pdf) as a binary Blob. The server
 * picks the output format from the `accept` header, so the header is set based
 * on the requested format. The raw-response middleware returns XLSX/PDF as a
 * Blob; CSV comes back as text from the default fetcher and is wrapped in a
 * Blob here for a consistent return type.
 */
export async function fetchExportResource(
  fetcher: ApiFetcher,
  params: ExportResourceParams,
): Promise<ExportResourceResponse> {
  const get = fetcher.path(EXPORT_ROUTES.RESOURCE).method('get').create();
  const accept =
    params.format === 'xlsx'
      ? 'application/xlsx'
      : params.format === 'pdf'
        ? 'application/pdf'
        : 'application/csv';
  const response = await get(
    { resource: params.resource, format: params.format } as never,
    {
      headers: { Accept: accept },
    },
  );
  const data = response.data as Blob | string;
  return data instanceof Blob ? data : new Blob([data]);
}
