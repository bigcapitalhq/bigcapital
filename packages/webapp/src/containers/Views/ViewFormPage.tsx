import { Intent, Alert } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React, { useEffect, useState, useCallback } from 'react';
import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import type { WithResourcesActionsProps } from '@/containers/Resources/withResourcesActions';
import type { ViewMeta } from '@/containers/Views/ViewForm';
import type { WithViewsActionsProps } from '@/containers/Views/withViewsActions';
import {
  If,
  AppToaster,
  DashboardInsider,
  DashboardPageContent,
  FormattedMessage as T,
} from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withResourcesActions } from '@/containers/Resources/withResourcesActions';
import { ViewForm } from '@/containers/Views/ViewForm';
import { withViewsActions } from '@/containers/Views/withViewsActions';

interface ViewFormPageProps
  extends WithDashboardActionsProps,
    WithResourcesActionsProps,
    WithViewsActionsProps {}

function ViewFormPageInner({
  // #withDashboardActions
  changePageTitle,

  requestFetchResourceFields,
  requestFetchResourceColumns,
  requestFetchViewResource,

  requestFetchView,
  requestDeleteView,
}: ViewFormPageProps) {
  const { resource_slug: resourceSlug, view_id: viewId } = useParams<{
    resource_slug?: string;
    view_id?: string;
  }>();
  const [stateDeleteView, setStateDeleteView] = useState<ViewMeta | null>(null);

  const fetchHook = useAsync(async () => {
    return Promise.all([
      ...(resourceSlug
        ? [
            requestFetchResourceColumns(resourceSlug),
            requestFetchResourceFields(resourceSlug),
          ]
        : viewId
          ? [requestFetchViewResource(viewId)]
          : []),
      ...(viewId ? [requestFetchView(viewId)] : []),
    ]);
  }, []);

  useEffect(() => {
    if (viewId) {
      changePageTitle(intl.get('edit_custom_view'));
    } else {
      changePageTitle(intl.get('new_custom_view'));
    }
    return () => {
      changePageTitle('');
    };
  }, [viewId, changePageTitle]);

  // Handle delete view button click.
  const handleDeleteView = useCallback((view: ViewMeta | null) => {
    setStateDeleteView(view);
  }, []);

  // Handle cancel delete button click.
  const handleCancelDeleteView = useCallback(() => {
    setStateDeleteView(null);
  }, []);

  // Handle confirm delete custom view.
  const handleConfirmDeleteView = useCallback(() => {
    if (!stateDeleteView?.id) {
      return;
    }
    requestDeleteView(stateDeleteView.id).then(() => {
      setStateDeleteView(null);
      AppToaster.show({
        message: intl.get('the_custom_view_has_been_deleted_successfully'),
        intent: Intent.SUCCESS,
      });
    });
  }, [requestDeleteView, stateDeleteView]);

  return (
    <DashboardInsider
      name={'view-form'}
      loading={fetchHook.loading}
      mount={false}
    >
      <DashboardPageContent>
        <If condition={!!fetchHook.value}>
          <ViewForm
            viewId={viewId}
            resourceName={resourceSlug}
            onDelete={handleDeleteView}
          />

          <Alert
            cancelButtonText={intl.get('cancel')}
            confirmButtonText={intl.get('delete')}
            icon="trash"
            intent={Intent.DANGER}
            isOpen={stateDeleteView != null}
            onCancel={handleCancelDeleteView}
            onConfirm={handleConfirmDeleteView}
          >
            <p>
              {intl.formatHTMLMessage({
                id: 'once_delete_these_views_you_will_not_able_restore_them',
              })}
            </p>
          </Alert>
        </If>

        <If condition={!!fetchHook.error}>
          <h4>
            <T id={'something_wrong'} />
          </h4>
        </If>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export const ViewFormPage = FF.pipe(
  ViewFormPageInner,
  withResourcesActions,
  withViewsActions,
  withDashboardActions,
);
