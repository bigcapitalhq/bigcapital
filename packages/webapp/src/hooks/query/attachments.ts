// @ts-nocheck
import { useMutation } from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase } from '@/utils';

interface UploadAttachmentResponse {
  createdAt: string;
  id: number;
  key: string;
  mimeType: string;
  originName: string;
  size: number;
}

/**
 * Uploads the given attachments.
 */
export function useUploadAttachments(props) {
  const apiRequest = useApiRequest();

  return useMutation<UploadAttachmentResponse>(
    (values) =>
      apiRequest
        .post('attachments', values)
        .then((res) => transformToCamelCase(res.data?.data)),
    props,
  );
}

/**
 * Deletes the given attachment key.
 */
export function useDeleteAttachment(props) {
  const apiRequest = useApiRequest();

  return useMutation(
    (key: string) => apiRequest.delete(`attachments/${key}`),
    props,
  );
}

/**
 * Uploads the given attachments.
 */
export function useGetPresignedUrlAttachment(props) {
  const apiRequest = useApiRequest();

  return useMutation(
    (key: string) =>
      apiRequest
        .get(`attachments/${key}/presigned-url`)
        .then((res) => res.data),
    props,
  );
}
