// @ts-nocheck
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { DashboardCard, DashboardInsider } from '@/components';
import { useAssetFormContext } from './AssetFormProvider';
import { AssetFormFields } from './AssetFormFields';
import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';

/**
 * Asset form schema.
 */
const AssetFormSchema = Yup.object().shape({
  name: Yup.string().required('Asset name is required'),
  code: Yup.string().nullable(),
  assetAccountId: Yup.number().required('Asset account is required'),
  purchasePrice: Yup.number().min(0).required('Purchase price is required'),
  purchaseDate: Yup.date().required('Purchase date is required'),
  depreciationMethod: Yup.string().oneOf(['straight_line', 'declining_balance']).required(),
  depreciationRate: Yup.number().when('depreciationMethod', {
    is: 'declining_balance',
    then: Yup.number().required('Depreciation rate is required'),
  }),
  usefulLifeYears: Yup.number().when('depreciationMethod', {
    is: 'straight_line',
    then: Yup.number().required('Useful life is required'),
  }),
  residualValue: Yup.number().min(0).default(0),
  depreciationStartDate: Yup.date().required('Depreciation start date is required'),
  depreciationExpenseAccountId: Yup.number().required('Depreciation expense account is required'),
  accumulatedDepreciationAccountId: Yup.number().required('Accumulated depreciation account is required'),
});

/**
 * Asset form initial values.
 */
function useInitialValues(asset) {
  return React.useMemo(() => {
    if (asset) {
      return {
        name: asset.name || '',
        code: asset.code || '',
        description: asset.description || '',
        assetAccountId: asset.assetAccountId || '',
        categoryId: asset.categoryId || '',
        purchasePrice: asset.purchasePrice || 0,
        purchaseDate: asset.purchaseDate || '',
        purchaseReference: asset.purchaseReference || '',
        depreciationMethod: asset.depreciationMethod || 'straight_line',
        depreciationRate: asset.depreciationRate || '',
        usefulLifeYears: asset.usefulLifeYears || '',
        residualValue: asset.residualValue || 0,
        depreciationStartDate: asset.depreciationStartDate || '',
        depreciationFrequency: asset.depreciationFrequency || 'monthly',
        depreciationExpenseAccountId: asset.depreciationExpenseAccountId || '',
        accumulatedDepreciationAccountId: asset.accumulatedDepreciationAccountId || '',
        openingDepreciation: asset.openingDepreciation || 0,
        serialNumber: asset.serialNumber || '',
        location: asset.location || '',
      };
    }
    return {
      name: '',
      code: '',
      description: '',
      assetAccountId: '',
      categoryId: '',
      purchasePrice: 0,
      purchaseDate: '',
      purchaseReference: '',
      depreciationMethod: 'straight_line',
      depreciationRate: '',
      usefulLifeYears: '',
      residualValue: 0,
      depreciationStartDate: '',
      depreciationFrequency: 'monthly',
      depreciationExpenseAccountId: '',
      accumulatedDepreciationAccountId: '',
      openingDepreciation: 0,
      serialNumber: '',
      location: '',
    };
  }, [asset]);
}

/**
 * Asset form.
 */
export function AssetForm({ assetId, onSubmitSuccess, onCancel }) {
  const { isNewMode, asset, isAssetLoading, isSubmitting, createAssetMutate, editAssetMutate } = useAssetFormContext();
  const initialValues = useInitialValues(asset);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (isNewMode) {
        await createAssetMutate(values);
        AppToaster.show({
          message: intl.get('asset_created_successfully'),
          intent: Intent.SUCCESS,
        });
      } else {
        await editAssetMutate([assetId, values]);
        AppToaster.show({
          message: intl.get('asset_updated_successfully'),
          intent: Intent.SUCCESS,
        });
      }
      onSubmitSuccess?.();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        AppToaster.show({
          message: error.message || intl.get('error_saving_asset'),
          intent: Intent.DANGER,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardInsider loading={isAssetLoading} name="asset-form">
      <DashboardCard page>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={AssetFormSchema}
          onSubmit={handleSubmit}
        >
          <AssetFormFields onCancel={onCancel} isSubmitting={isSubmitting} />
        </Formik>
      </DashboardCard>
    </DashboardInsider>
  );
}
