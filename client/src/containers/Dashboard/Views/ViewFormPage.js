import React, {useEffect, useState, useCallback} from 'react';
import { useAsync } from 'react-use';
import { useParams, useHistory } from 'react-router-dom';
import { Intent, Alert } from '@blueprintjs/core';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import ViewForm from 'components/Views/ViewForm';
import DashboardConnect from 'connectors/Dashboard.connector';
import ResourceConnect from 'connectors/Resource.connector';
import ViewConnect from 'connectors/View.connector';
import {compose} from 'utils';
import AppToaster from 'components/AppToaster';

function ViewFormPage({
  changePageTitle,
  fetchResourceFields,
  fetchResourceColumns,
  fetchView,
  getResourceColumns,
  getResourceFields,
  submitView,
  getViewMeta,
  deleteView,
}) {
  const { resource_slug: resourceSlug, view_id: viewId } = useParams();

  const columns = getResourceColumns('accounts');
  const fields = getResourceFields('accounts');

  const viewForm = (viewId) ? getViewMeta(viewId) : null;

  const [stateDeleteView, setStateDeleteView] = useState(null);

  useEffect(() => {
    if (viewId) {
      changePageTitle('Edit Custom View');
    } else {
      changePageTitle('New Custom View');
    }
  }, [viewId, changePageTitle]);

  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchResourceColumns('accounts'),
      fetchResourceFields('accounts'),
      ...(viewId) ? [
        fetchView(viewId),
      ] : [],
    ]);
  }, []);

  const handleDeleteView = useCallback((view) => {
    setStateDeleteView(view);
  }, []);

  const handleCancelDeleteView = useCallback(() => {
    setStateDeleteView(null);
  }, []);

  const handleConfirmDeleteView = useCallback(() => {
    deleteView(stateDeleteView.id).then((response) => {
      setStateDeleteView(null);
      AppToaster.show({
        message: 'the_custom_view_has_been_deleted',
      });
    })
  }, [deleteView, stateDeleteView]);

  return (
    <DashboardInsider name={'view-form'} loading={fetchHook.loading} mount={false}>
      <DashboardPageContent>
        <ViewForm
          resourceName={resourceSlug}
          columns={columns}
          fields={fields}
          viewForm={viewForm}
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
      </DashboardPageContent>
    </DashboardInsider>   
  );
}

export default compose(
  DashboardConnect,
  ResourceConnect,
  ViewConnect,
)(ViewFormPage);