import React, {useEffect, useState, useMemo, useCallback} from 'react';
import { useAsync } from 'react-use';
import { useParams } from 'react-router-dom';
import { Intent, Alert } from '@blueprintjs/core';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import ViewForm from 'containers/Views/ViewForm';
import withResourcesActions from 'containers/Resources/withResourcesActions';
import withViewsActions from 'containers/Views/withViewsActions';
import withDashboard from 'containers/Dashboard/withDashboard';
import AppToaster from 'components/AppToaster';
import {compose} from 'utils';
import { If } from 'components';

// @flow
function ViewFormPage({
  changePageTitle,
  changePageSubtitle,

  requestFetchResourceFields,
  requestFetchResourceColumns,
  requestFetchViewResource,

  requestFetchView,
  requestDeleteView,
}) {
  const { resource_slug: resourceSlug, view_id: viewId } = useParams();
  const [stateDeleteView, setStateDeleteView] = useState(null);

  const fetchHook = useAsync(async () => {
    return Promise.all([
      ...(resourceSlug) ? [
        requestFetchResourceColumns(resourceSlug),
        requestFetchResourceFields(resourceSlug),
      ] : (viewId) ? [
        requestFetchViewResource(viewId),
      ] : [],
      ...(viewId) ? [
        requestFetchView(viewId),
      ] : [],
    ]);
  }, []);

  useEffect(() => {
    if (viewId) {
      changePageTitle('Edit Custom View');
    } else {
      changePageTitle('New Custom View');
    }
    return () => {
      changePageTitle('');
    };
  }, [viewId, changePageTitle]);

  const handleDeleteView = useCallback((view) => {
    setStateDeleteView(view);
  }, []);

  const handleCancelDeleteView = useCallback(() => {
    setStateDeleteView(null);
  }, []);

  const handleConfirmDeleteView = useCallback(() => {
    requestDeleteView(stateDeleteView.id).then((response) => {
      setStateDeleteView(null);
      AppToaster.show({
        message: 'the_custom_view_has_been_deleted',
        intent: Intent.SUCCESS,
      });
    })
  }, [requestDeleteView, stateDeleteView]);

  return (
    <DashboardInsider
      name={'view-form'}
      loading={fetchHook.loading}
      mount={false}>
      <DashboardPageContent>
        <If condition={fetchHook.value}>
          <ViewForm
            viewId={viewId}
            resourceName={resourceSlug}
            onDelete={handleDeleteView} />

          <Alert
            cancelButtonText="Cancel"
            confirmButtonText="Move to Trash"
            icon="trash"
            intent={Intent.DANGER}
            isOpen={stateDeleteView}
            onCancel={handleCancelDeleteView}
            onConfirm={handleConfirmDeleteView}>
            <p>
            Are you sure you want to move <b>filename</b> to Trash? You will be able to restore it later,
            but it will become private to you.
            </p>
          </Alert>
        </If>

        <If condition={fetchHook.error}>
          <h4>Something wrong</h4>
        </If>
      </DashboardPageContent>
    </DashboardInsider>   
  );
}

export default compose(
  withDashboard,
  withViewsActions,
  withResourcesActions
)(ViewFormPage);