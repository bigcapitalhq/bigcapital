// @ts-nocheck
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AssetForm } from './AssetForm';
import { AssetFormProvider } from './AssetFormProvider';

/**
 * Asset form page.
 */
export default function AssetFormPage() {
  const { id } = useParams();
  const history = useHistory();

  const handleSubmitSuccess = () => {
    history.push('/assets');
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <AssetFormProvider assetId={id}>
      <AssetForm
        assetId={id}
        onSubmitSuccess={handleSubmitSuccess}
        onCancel={handleCancel}
      />
    </AssetFormProvider>
  );
}
