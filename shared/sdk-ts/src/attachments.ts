import { withFormData, type ApiFetcher } from './fetch-utils';
import { paths } from './schema';

export const ATTACHMENTS_ROUTES = {
  LIST: '/api/attachments',
  BY_ID: '/api/attachments/{id}',
  PRESIGNED_URL: '/api/attachments/{id}/presigned-url',
} as const satisfies Record<string, keyof paths>;

/** Response shape from POST /api/attachments (upload). Schema may not define it; server returns { data }. */
export interface UploadAttachmentResponse {
  id: number;
  key: string;
  mimeType: string;
  originName: string;
  size: number;
  createdAt: string;
}

/**
 * Upload an attachment via multipart/form-data. The generated typed fetcher's
 * JSON body serializer would turn a `FormData` instance into `"{}"` (dropping
 * the file entirely), so the body is smuggled through the `withFormData` init
 * property that the form-data middleware swaps back in before `fetch` runs.
 * Same pattern as `uploadImportFile`; keeps the call on the full middleware
 * pipeline (camelCase response transform, `ApiError` on failure).
 */
export async function uploadAttachment(
  fetcher: ApiFetcher,
  formData: FormData
): Promise<UploadAttachmentResponse> {
  const post = fetcher.path(ATTACHMENTS_ROUTES.LIST).method('post').create();
  const res = (await post({} as never, withFormData(formData))) as {
    data?: { data?: UploadAttachmentResponse };
  };
  const data = res?.data?.data;
  if (!data) {
    throw new Error('Upload attachment: no data in response');
  }
  return data;
}

export async function deleteAttachment(fetcher: ApiFetcher, id: string): Promise<void> {
  const del = fetcher.path(ATTACHMENTS_ROUTES.BY_ID).method('delete').create();
  await del({ id });
}

export async function fetchAttachmentPresignedUrl(
  fetcher: ApiFetcher,
  id: string
): Promise<unknown> {
  const get = fetcher.path(ATTACHMENTS_ROUTES.PRESIGNED_URL).method('get').create();
  const { data } = await get({ id });
  return data;
}
