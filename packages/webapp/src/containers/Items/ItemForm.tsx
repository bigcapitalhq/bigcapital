import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { ItemFormFormik } from './ItemFormFormik';
import { useItemFormContext, ItemFormProvider } from './ItemFormProvider';
import type { ItemFormValues, ItemFormSubmitPayload } from './types';
import type { FormikHelpers } from 'formik';
import { DashboardInsider, Box } from '@/components';
import { useDashboardPageTitle } from '@/hooks/state';

/**
 * Item form dashboard title.
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
 */
function ItemFormPageLoading({ children }: { children: React.ReactNode }) {
  const { isFormLoading } = useItemFormContext();

  return (
    <DashboardInsider loading={isFormLoading}>{children}</DashboardInsider>
  );
}

interface ItemFormProps {
  itemId?: number;
}

/**
 * Item form of the page.
 */
export function ItemForm({ itemId }: ItemFormProps) {
  // History context.
  const history = useHistory();

  // Handle the form submit success.
  const handleSubmitSuccess = (
    _values: ItemFormValues,
    _form: FormikHelpers<ItemFormValues>,
    submitPayload: ItemFormSubmitPayload,
  ) => {
    if (submitPayload.redirect) {
      history.push('/items');
    }
  };

  return (
    <ItemFormProvider itemId={itemId}>
      <ItemFormDashboardTitle />

      <ItemFormPageLoading>
        <Box mx={'auto'} maxWidth={800}>
          <ItemFormFormik onSubmitSuccess={handleSubmitSuccess} />
        </Box>
      </ItemFormPageLoading>
    </ItemFormProvider>
  );
}
