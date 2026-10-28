import { Intent } from '@blueprintjs/core';
import { useCallback } from 'react';
import intl from 'react-intl-universal';
import { useAuthActions, useSetGlobalErrors } from './state';
import type { ApiError } from 'openapi-typescript-fetch';
import { AppToaster } from '@/components/AppToaster';
import { ERROR } from '@/constants/errors';

interface InsufficientStockItem {
  itemId: number;
  itemName: string;
  availableQuantity: number;
  requestedQuantity: number;
  warehouseId?: number;
}

interface ApiErrorEntry {
  type?: string;
  message?: string;
  payload?: any;
}

/**
 * Returns a stable callback that translates SDK fetcher rejections into
 * global-error Redux state. Mirrors the response interceptor that used to
 * live on the legacy axios instance (see useRequest.tsx), but adapted to
 * openapi-typescript-fetch's ApiError shape (`error.data` instead of
 * `error.response.data`).
 */
export function useApiFetcherOnError() {
  const setGlobalErrors = useSetGlobalErrors();
  const { setLogout } = useAuthActions();

  return useCallback(
    (error: unknown) => {
      const { status, data } = (error as ApiError) ?? {};
      if (typeof status !== 'number') return;

      if (status >= 500) {
        setGlobalErrors({ something_wrong: true });
      }
      if (status === 401) {
        setGlobalErrors({ session_expired: true });
        setLogout();
      }
      if (status === 403) {
        setGlobalErrors({ access_denied: { message: data?.message } });
      }
      if (status === 429) {
        setGlobalErrors({ too_many_requests: true });
      }
      if (status === 400 && Array.isArray(data?.errors)) {
        const errors = data.errors as ApiErrorEntry[];
        const lockedError = errors.find(
          (e) => e.type === 'TRANSACTIONS_DATE_LOCKED',
        );
        if (lockedError) {
          setGlobalErrors({
            transactionsLocked: { ...lockedError.payload },
          });
        }
        const insufficientStockError = errors.find(
          (e) => e.type === ERROR.INVENTORY_ITEM_INSUFFICIENT_STOCK,
        );
        if (insufficientStockError) {
          const shortage = insufficientStockError.payload?.items?.[0] as
            | InsufficientStockItem
            | undefined;
          const message = shortage
            ? intl.get(
                shortage.warehouseId
                  ? 'insufficient_stock_for_item_in_warehouse'
                  : 'insufficient_stock_for_item',
                {
                  itemName: shortage.itemName,
                  availableQuantity: shortage.availableQuantity,
                  requestedQuantity: shortage.requestedQuantity,
                },
              )
            : insufficientStockError.message ||
              intl.get('something_went_wrong');

          AppToaster.show({ message, intent: Intent.DANGER });
        }
        if (
          errors.find((e) => e.type === 'ORGANIZATION.SUBSCRIPTION.INACTIVE')
        ) {
          setGlobalErrors({ subscriptionInactive: true });
        }
        if (errors.find((e) => e.type === 'USER_INACTIVE')) {
          setGlobalErrors({ userInactive: true });
          setLogout();
        }
      }
    },
    [setGlobalErrors, setLogout],
  );
}
