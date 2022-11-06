// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import ItemFormFormik from './ItemFormFormik';

import { useDashboardPageTitle } from '@/hooks/state';
import { useItemFormContext, ItemFormProvider } from './ItemFormProvider';
import { DashboardInsider, DashboardCard } from '@/components';

/**
 * Item form dashboard title.
 * @returns {null}
 */
function ItemFormDashboardTitle() {
  // Change page title dispatcher.
  const changePageTitle = useDashboardPageTitle();

  // Item form context.
  const { isNewMode } = useItemFormContext();

  // Changes the page title in new and edit mode.
  React.useEffect(() => {
    isNewMode
      ? changePageTitle(intl.get('new_item'))
      : changePageTitle(intl.get('edit_item_details'));
  }, [changePageTitle, isNewMode]);

  return null;
}

/**
 * Item form page loading state indicator.
 * @returns {JSX}
 */
function ItemFormPageLoading({ children }) {
  const { isFormLoading } = useItemFormContext();

  return (
    <DashboardItemFormPageInsider loading={isFormLoading} name={'item-form'}>
      {children}
    </DashboardItemFormPageInsider>
  );
}

/**
 * Item form of the page.
 * @returns {JSX}
 */
export default function ItemForm({ itemId }) {
  // History context.
  const history = useHistory();

  // Handle the form submit success.
  const handleSubmitSuccess = (values, form, submitPayload) => {
    if (submitPayload.redirect) {
      history.push('/items');
    }
  };
  // Handle cancel button click.
  const handleFormCancel = () => {
    history.goBack();
  };

  return (
    <ItemFormProvider itemId={itemId}>
      <ItemFormDashboardTitle />

      <ItemFormPageLoading>
        <DashboardCard page>
          <ItemFormPageFormik
            onSubmitSuccess={handleSubmitSuccess}
            onCancel={handleFormCancel}
          />
        </DashboardCard>
      </ItemFormPageLoading>
    </ItemFormProvider>
  );
}

const DashboardItemFormPageInsider = styled(DashboardInsider)`
  padding-bottom: 64px;
`;

const ItemFormPageFormik = styled(ItemFormFormik)`
  .page-form {
    &__floating-actions {
      margin-left: -40px;
      margin-right: -40px;
    }
  }
`;
