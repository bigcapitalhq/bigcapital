// @ts-nocheck
import React, { createContext, useContext, useMemo } from 'react';
import { useAsset, useCreateAsset, useEditAsset } from '@/hooks/query/assets';

const AssetFormContext = createContext();

/**
 * Asset form provider.
 */
export function AssetFormProvider({ assetId, children }) {
  const isNewMode = !assetId;

  const { data: asset, isLoading: isAssetLoading } = useAsset(assetId, {
    enabled: !!assetId,
  });

  const createAssetMutation = useCreateAsset();
  const editAssetMutation = useEditAsset();

  const isSubmitting = createAssetMutation.isLoading || editAssetMutation.isLoading;

  const value = {
    assetId,
    asset,
    isNewMode,
    isAssetLoading,
    isSubmitting,
    createAssetMutate: createAssetMutation.mutateAsync,
    editAssetMutate: editAssetMutation.mutateAsync,
  };

  return (
    <AssetFormContext.Provider value={value}>
      {children}
    </AssetFormContext.Provider>
  );
}

/**
 * Hook to use asset form context.
 */
export function useAssetFormContext() {
  return useContext(AssetFormContext);
}
