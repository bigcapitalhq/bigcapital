import classNames from 'classnames';
import { isEmpty } from 'lodash';
import React, { ReactNode } from 'react';
import type { TrackingCategoriesList } from '@bigcapital/sdk-ts';
import { CLASSES } from '@/constants/classes';
import { useTrackingCategories } from '@/hooks/query';

interface TrackingCategoriesContextValue {
  trackingCategories: TrackingCategoriesList | undefined;
  isTrackingCategoriesLoading: boolean;
  isTrackingCategoriesFetching: boolean;
  isEmptyStatus: boolean;
}

const TrackingCategoriesContext =
  React.createContext<TrackingCategoriesContextValue>(
    {} as TrackingCategoriesContextValue,
  );

interface TrackingCategoriesProviderProps {
  children: ReactNode;
}

function TrackingCategoriesProvider({
  ...props
}: TrackingCategoriesProviderProps) {
  const {
    data: trackingCategories,
    isLoading: isTrackingCategoriesLoading,
    isFetching: isTrackingCategoriesFetching,
  } = useTrackingCategories();

  const isEmptyStatus =
    (isEmpty(trackingCategories) && !isTrackingCategoriesLoading) || false;

  const provider: TrackingCategoriesContextValue = {
    trackingCategories,
    isTrackingCategoriesLoading,
    isTrackingCategoriesFetching,
    isEmptyStatus,
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_BRANCHES,
      )}
    >
      <TrackingCategoriesContext.Provider value={provider} {...props} />
    </div>
  );
}

const useTrackingCategoriesContext = () =>
  React.useContext<TrackingCategoriesContextValue>(TrackingCategoriesContext);

export { TrackingCategoriesProvider, useTrackingCategoriesContext };
