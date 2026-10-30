import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import { TrackingCategoriesDataTable } from './TrackingCategoriesDataTable';
import { TrackingCategoriesEmptyStatus } from './TrackingCategoriesEmptyStatus';
import { useTrackingCategoriesContext } from './TrackingCategoriesProvider';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';

type TrackingCategoriesInnerProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

function TrackingCategoriesInner({
  changePreferencesPageTitle,
}: TrackingCategoriesInnerProps) {
  const { isEmptyStatus } = useTrackingCategoriesContext();

  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('tracking_categories.label'));
  }, [changePreferencesPageTitle]);

  return (
    <React.Fragment>
      {isEmptyStatus ? (
        <TrackingCategoriesEmptyStatus />
      ) : (
        <TrackingCategoriesDataTable />
      )}
    </React.Fragment>
  );
}

export const TrackingCategories = FF.pipe(
  TrackingCategoriesInner,
  withDashboardActions,
);
