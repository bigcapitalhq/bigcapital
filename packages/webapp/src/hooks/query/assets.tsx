import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRequestQuery } from '../useQueryRequest';
import { useApiRequest } from '../useApiRequest';
import { transformPagination, transformTableStateToQuery } from '@/utils';
import { DEFAULT_PAGINATION } from '@/constants';

// Query keys
export const ASSETS = 'assets';
export const ASSET = 'asset';
export const ASSET_DEPRECIATION_SCHEDULE = 'asset_depreciation_schedule';

const transformAssetsResponse = (response) => {
  return {
    assets: response.data.assets,
    pagination: transformPagination(response.data.filterMeta),
    filterMeta: response.data.filterMeta,
  };
};

/**
 * Retrieves the assets list.
 */
export function useAssets(query, props) {
  return useRequestQuery(
    [ASSETS, query],
    {
      method: 'get',
      url: 'assets',
      params: { ...query },
    },
    {
      select: transformAssetsResponse,
      defaultData: {
        assets: [],
        pagination: DEFAULT_PAGINATION,
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieves a single asset.
 */
export function useAsset(id, props) {
  return useRequestQuery(
    [ASSET, id],
    {
      method: 'get',
      url: `assets/${id}`,
    },
    {
      select: (res) => res.data.asset,
      ...props,
    },
  );
}

/**
 * Creates a new asset.
 */
export function useCreateAsset(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('assets', values), {
    onSuccess: () => {
      queryClient.invalidateQueries(ASSETS);
    },
    ...props,
  });
}

/**
 * Edits an asset.
 */
export function useEditAsset(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(([id, values]) => apiRequest.put(`assets/${id}`, values), {
    onSuccess: (res, [id]) => {
      queryClient.invalidateQueries([ASSET, id]);
      queryClient.invalidateQueries(ASSETS);
    },
    ...props,
  });
}

/**
 * Deletes an asset.
 */
export function useDeleteAsset(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`assets/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(ASSETS);
    },
    ...props,
  });
}

/**
 * Bulk deletes assets.
 */
export function useBulkDeleteAssets(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((ids) => apiRequest.post('assets/bulk-delete', { ids }), {
    onSuccess: () => {
      queryClient.invalidateQueries(ASSETS);
    },
    ...props,
  });
}

/**
 * Calculates depreciation schedule for an asset.
 */
export function useCalculateDepreciation(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`assets/${id}/calculate-depreciation`), {
    onSuccess: (res, id) => {
      queryClient.invalidateQueries([ASSET, id]);
      queryClient.invalidateQueries([ASSET_DEPRECIATION_SCHEDULE, id]);
    },
    ...props,
  });
}

/**
 * Retrieves the depreciation schedule for an asset.
 */
export function useAssetDepreciationSchedule(id, props) {
  return useRequestQuery(
    [ASSET_DEPRECIATION_SCHEDULE, id],
    {
      method: 'get',
      url: `assets/${id}/depreciation-schedule`,
    },
    {
      select: (res) => res.data.schedule,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Disposes an asset.
 */
export function useDisposeAsset(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(([id, values]) => apiRequest.post(`assets/${id}/dispose`, values), {
    onSuccess: (res, [id]) => {
      queryClient.invalidateQueries([ASSET, id]);
      queryClient.invalidateQueries(ASSETS);
    },
    ...props,
  });
}
