// @ts-nocheck
import React, { createContext, useContext, useState, useMemo } from 'react';
import { useAssets } from '@/hooks/query/assets';
import { transformTableStateToQuery } from '@/utils';

const AssetsListContext = createContext();

/**
 * Assets list provider.
 */
export function AssetsListProvider({ children }) {
  const [tableState, setTableState] = useState({
    pageIndex: 0,
    pageSize: 20,
    sortBy: [],
  });
  const [selectedRows, setSelectedRows] = useState([]);

  const query = useMemo(() => transformTableStateToQuery(tableState), [tableState]);

  const {
    data: assetsData,
    isLoading: isAssetsLoading,
    isFetching: isAssetsFetching,
  } = useAssets(query);

  const isEmptyStatus = assetsData?.assets?.length === 0 && !isAssetsLoading;

  const value = {
    assets: assetsData?.assets || [],
    pagination: assetsData?.pagination,
    isAssetsLoading,
    isAssetsFetching,
    isEmptyStatus,
    tableState,
    setTableState,
    selectedRows,
    setSelectedRows,
  };

  return (
    <AssetsListContext.Provider value={value}>
      {children}
    </AssetsListContext.Provider>
  );
}

/**
 * Hook to use assets list context.
 */
export function useAssetsListContext() {
  return useContext(AssetsListContext);
}
