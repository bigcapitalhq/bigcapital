// @ts-nocheck
import { Intent, Alert } from '@blueprintjs/core';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import intl from 'react-intl-universal';
import {
  If,
  AppToaster,
  DashboardInsider,
  DashboardPageContent,
  FormattedMessage as T,
  FormattedHTMLMessage,
} from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { withResourcesActions } from '@/containers/Resources/withResourcesActions';
import type { WithResourcesActionsProps } from '@/containers/Resources/withResourcesActions';
import { ViewForm } from '@/containers/Views/ViewForm';
import { withViewsActions } from '@/containers/Views/withViewsActions';
import type { WithViewsActionsProps } from '@/containers/Views/withViewsActions';
import { compose } from '@/utils';

interface ViewFormPageProps
  extends WithDashboardActionsProps,
    WithViewsActionsProps,
    WithResourcesActionsProps {}

interface ViewItem {
  id: number;
}

function ViewFormPageInner({
  // #withDashboardActions
  changePageTitle,
  changePageSubtitle,

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
  const [stateDeleteView, setStateDeleteView] = useState<ViewItem | null>(null);

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
  const handleDeleteView = useCallback((view: ViewItem) => {
    setStateDeleteView(view);
  }, []);

  // Handle cancel delete button click.
  const handleCancelDeleteView = useCallback(() => {
    setStateDeleteView(null);
  }, []);

  // Handle confirm delete custom view.
  const handleConfirmDeleteView = useCallback(() => {
    if (!stateDeleteView) {
      return;
    }
    requestDeleteView(stateDeleteView.id).then((response) => {
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
        <If condition={fetchHook.value}>
          <ViewForm
            viewId={viewId}
            resourceName={resourceSlug}
            onDelete={handleDeleteView}
          />

          <Alert
            cancelButtonText={<T id={'cancel'} />}
            confirmButtonText={<T id={'delete'} />}
            icon="trash"
            intent={Intent.DANGER}
            isOpen={stateDeleteView !== null}
            onCancel={handleCancelDeleteView}
            onConfirm={handleConfirmDeleteView}
          >
            <p>
              <FormattedHTMLMessage
                id={'once_delete_these_views_you_will_not_able_restore_them'}
              />
            </p>
          </Alert>
        </If>

        <If condition={fetchHook.error}>
          <h4>
            <T id={'something_wrong'} />
          </h4>
        </If>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export const ViewFormPage = compose(
  withDashboardActions,
  withViewsActions,
  withResourcesActions,
)(ViewFormPageInner);
