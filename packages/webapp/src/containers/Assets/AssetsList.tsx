// @ts-nocheck
import React from 'react';
import { DashboardPageContent, DashboardContentTable } from '@/components';
import { AssetsListProvider, useAssetsListContext } from './AssetsListProvider';
import { AssetsActionsBar } from './AssetsActionsBar';
import { AssetsDataTable } from './AssetsDataTable';
import { AssetsEmptyStatus } from './AssetsEmptyStatus';

/**
 * Assets list page content.
 */
function AssetsListContent() {
  const { isEmptyStatus } = useAssetsListContext();

  if (isEmptyStatus) {
    return (
      <DashboardPageContent>
        <AssetsEmptyStatus />
      </DashboardPageContent>
    );
  }

  return (
    <DashboardPageContent>
      <AssetsActionsBar />
      <AssetsDataTable />
    </DashboardPageContent>
  );
}

/**
 * Assets list page.
 */
export default function AssetsList() {
  return (
    <AssetsListProvider>
      <AssetsListContent />
    </AssetsListProvider>
  );
}
