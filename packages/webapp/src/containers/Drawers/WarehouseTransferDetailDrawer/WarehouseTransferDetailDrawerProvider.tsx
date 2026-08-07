import React, { createContext } from 'react';
import intl from 'react-intl-universal';
import type { WarehouseTransferDetailDrawerContextValue } from './types';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useWarehouseTransfer } from '@/hooks/query';

const WarehouseTransferDetailDrawerContext =
  createContext<WarehouseTransferDetailDrawerContextValue>(
    {} as WarehouseTransferDetailDrawerContextValue,
  );

interface WarehouseTransferDetailDrawerProviderProps {
  warehouseTransferId?: number | null;
  children?: React.ReactNode;
}

function WarehouseTransferDetailDrawerProvider({
  warehouseTransferId,
  ...props
}: WarehouseTransferDetailDrawerProviderProps) {
  const { data: warehouseTransfer, isLoading: isWarehouseTransferLoading } =
    useWarehouseTransfer(warehouseTransferId, {
      enabled: !!warehouseTransferId,
    });

  const provider: WarehouseTransferDetailDrawerContextValue = {
    warehouseTransfer,
    warehouseTransferId,
  };

  return (
    <DrawerLoading loading={isWarehouseTransferLoading}>
      <DrawerHeaderContent
        name={DRAWERS.WAREHOUSE_TRANSFER_DETAILS}
        title={intl.get('warehouse_transfer.drawer.title', {
          number: warehouseTransfer?.transactionNumber
            ? `(${warehouseTransfer.transactionNumber})`
            : null,
        })}
      />
      <WarehouseTransferDetailDrawerContext.Provider
        value={provider}
        {...props}
      />
    </DrawerLoading>
  );
}

const useWarehouseDetailDrawerContext = () =>
  React.useContext(WarehouseTransferDetailDrawerContext);

export {
  WarehouseTransferDetailDrawerProvider,
  useWarehouseDetailDrawerContext,
};
