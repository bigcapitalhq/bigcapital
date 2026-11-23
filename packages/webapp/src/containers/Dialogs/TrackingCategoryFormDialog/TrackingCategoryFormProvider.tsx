import React, { createContext } from 'react';
import type { TrackingCategoryFormContextValue } from './types';
import { DialogContent } from '@/components';
import {
  useCreateTrackingCategory,
  useEditTrackingCategory,
  useTrackingCategory,
} from '@/hooks/query';

const TrackingCategoryFormContext =
  createContext<TrackingCategoryFormContextValue>(
    {} as TrackingCategoryFormContextValue,
  );

interface TrackingCategoryFormProviderProps {
  dialogName: string;
  categoryId?: number | null;
  children?: React.ReactNode;
}

/**
 * Tracking category form dialog provider.
 */
function TrackingCategoryFormProvider({
  dialogName,
  categoryId,
  ...props
}: TrackingCategoryFormProviderProps) {
  const { mutateAsync: createTrackingCategoryMutate } =
    useCreateTrackingCategory();
  const { mutateAsync: editTrackingCategoryMutate } = useEditTrackingCategory();

  const { data: category, isLoading: isCategoryLoading } = useTrackingCategory(
    categoryId,
    {
      enabled: !!categoryId,
    },
  );

  const provider: TrackingCategoryFormContextValue = {
    dialogName,
    category,
    categoryId,
    createTrackingCategoryMutate,
    editTrackingCategoryMutate,
  };

  return (
    <DialogContent isLoading={isCategoryLoading}>
      <TrackingCategoryFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useTrackingCategoryFormContext = () =>
  React.useContext<TrackingCategoryFormContextValue>(
    TrackingCategoryFormContext,
  );

export { TrackingCategoryFormProvider, useTrackingCategoryFormContext };
