// @ts-nocheck
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from 'react-query';
import useApiRequest from '../useRequest';
import { transformToCamelCase } from '@/utils';

const QK = {
  CONNECTIONS: ['SQUARE_CONNECTIONS'],
  CONNECTION: (id: number) => ['SQUARE_CONNECTION', id],
  CATALOG: (id: number, cursor?: string) => ['SQUARE_CATALOG', id, cursor ?? ''],
  LOCATIONS: (id: number) => ['SQUARE_LOCATIONS', id],
  EVENTS: (id: number, filters: any) => ['SQUARE_EVENTS', id, filters],
} as const;

export interface SquareConnection {
  id: number;
  merchantId: string;
  environment: string;
  status: 'pending' | 'active' | 'disabled';
  statusMessage: string | null;
  clearingAccountId: number | null;
  feesExpenseAccountId: number | null;
  tipsLiabilityAccountId: number | null;
  walkInCustomerId: number | null;
  depositBankAccountId: number | null;
  squareWebhookSubscriptionId: string | null;
  connectedAt: string | null;
  disconnectedAt: string | null;
}

/**
 * List configured Square connections for the current tenant.
 */
export function useSquareConnections(options?: UseQueryOptions<SquareConnection[]>) {
  const apiRequest = useApiRequest();
  return useQuery<SquareConnection[]>(
    QK.CONNECTIONS,
    () =>
      apiRequest
        .get('/integrations/square/connections')
        .then((res) => transformToCamelCase(res.data)),
    options,
  );
}

export function useSquareConnection(
  id: number | null | undefined,
  options?: UseQueryOptions<SquareConnection>,
) {
  const apiRequest = useApiRequest();
  return useQuery<SquareConnection>(
    QK.CONNECTION(id as number),
    () =>
      apiRequest
        .get(`/integrations/square/connections/${id}`)
        .then((res) => transformToCamelCase(res.data)),
    { enabled: !!id, ...(options ?? {}) },
  );
}

/**
 * Fetches the OAuth authorization URL and redirects the browser. The backend
 * builds the URL (scopes, client id, redirect_uri are all server-controlled).
 */
export function useStartSquareOAuth() {
  const apiRequest = useApiRequest();
  return async (environment?: 'sandbox' | 'production') => {
    const res = await apiRequest.get('/integrations/square/oauth/start', {
      params: environment ? { environment } : {},
    });
    if (res.data?.url) {
      window.location.href = res.data.url;
    }
  };
}

interface UpdateSettingsValues {
  clearingAccountId?: number | null;
  feesExpenseAccountId?: number | null;
  tipsLiabilityAccountId?: number | null;
  walkInCustomerId?: number | null;
  depositBankAccountId?: number | null;
  status?: 'pending' | 'active' | 'disabled';
  webhookSignatureKey?: string;
}

export function useUpdateSquareSettings(
  connectionId: number,
  options?: UseMutationOptions<SquareConnection, Error, UpdateSettingsValues>,
) {
  const apiRequest = useApiRequest();
  const qc = useQueryClient();
  return useMutation<SquareConnection, Error, UpdateSettingsValues>(
    (values) =>
      apiRequest
        .patch(
          `/integrations/square/connections/${connectionId}/settings`,
          values,
        )
        .then((res) => transformToCamelCase(res.data)),
    {
      onSuccess: () => {
        qc.invalidateQueries(QK.CONNECTIONS);
        qc.invalidateQueries(QK.CONNECTION(connectionId));
      },
      ...options,
    },
  );
}

export function useDisconnectSquare(
  options?: UseMutationOptions<SquareConnection, Error, number>,
) {
  const apiRequest = useApiRequest();
  const qc = useQueryClient();
  return useMutation<SquareConnection, Error, number>(
    (connectionId) =>
      apiRequest
        .delete(`/integrations/square/connections/${connectionId}`)
        .then((res) => transformToCamelCase(res.data)),
    {
      onSuccess: () => {
        qc.invalidateQueries(QK.CONNECTIONS);
      },
      ...options,
    },
  );
}

export interface SquareCatalogRow {
  squareCatalogObjectId: string;
  squareObjectType: string;
  squareName: string;
  squareSku: string | null;
  itemVariationPrice: number | null;
  itemVariationCurrency: string | null;
  mappedItemId: number | null;
}

export function useSquareCatalog(
  connectionId: number,
  cursor?: string,
  options?: UseQueryOptions<{ items: SquareCatalogRow[]; nextCursor: string | null }>,
) {
  const apiRequest = useApiRequest();
  return useQuery(
    QK.CATALOG(connectionId, cursor),
    () =>
      apiRequest
        .get(
          `/integrations/square/connections/${connectionId}/catalog`,
          { params: cursor ? { cursor } : {} },
        )
        .then((res) => transformToCamelCase(res.data)),
    options,
  );
}

export interface SquareLocationRow {
  id: string;
  name: string;
  businessName: string | null;
  status: string;
  address: string | null;
}

export function useSquareLocations(
  connectionId: number,
  options?: UseQueryOptions<SquareLocationRow[]>,
) {
  const apiRequest = useApiRequest();
  return useQuery<SquareLocationRow[]>(
    QK.LOCATIONS(connectionId),
    () =>
      apiRequest
        .get(`/integrations/square/connections/${connectionId}/locations`)
        .then((res) => transformToCamelCase(res.data)),
    options,
  );
}

export function useUpsertSquareItemMapping(connectionId: number) {
  const apiRequest = useApiRequest();
  const qc = useQueryClient();
  return useMutation(
    (values: {
      squareCatalogObjectId: string;
      squareObjectType: string;
      squareName?: string;
      squareSku?: string;
      itemId?: number | null;
    }) =>
      apiRequest
        .put(
          `/integrations/square/connections/${connectionId}/catalog/mapping`,
          values,
        )
        .then((res) => transformToCamelCase(res.data)),
    {
      onSuccess: () => {
        qc.invalidateQueries(['SQUARE_CATALOG', connectionId]);
      },
    },
  );
}

export interface SquareEventRow {
  id: number;
  squareEventId: string;
  eventType: string;
  source: string;
  status: string;
  errorText: string | null;
  receivedAt: string;
  processedAt: string | null;
}

export function useSquareEventLog(
  connectionId: number,
  filters: { status?: string; eventType?: string; limit?: number; cursor?: number } = {},
) {
  const apiRequest = useApiRequest();
  return useQuery<{ events: SquareEventRow[]; nextCursor: number | null }>(
    QK.EVENTS(connectionId, filters),
    () =>
      apiRequest
        .get(`/integrations/square/connections/${connectionId}/events`, {
          params: filters,
        })
        .then((res) => transformToCamelCase(res.data)),
  );
}
