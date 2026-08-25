import { useFormikContext } from 'formik';
import * as R from 'ramda';
import { FSelect } from '../Forms';
import { createNewItemFromQuery, createNewItemRenderer } from './utils';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { useCreateAutofillListener } from '@/hooks/state/autofill';

interface CustomerSelectRootProps extends WithDrawerActionsProps {
  items: unknown[];
  allowCreate?: boolean;
  name: string;
  [key: string]: unknown;
}

interface CreatedItem {
  name: string;
}

/**
 * Customer select field.
 */
function CustomerSelectRoot({
  // #withDrawerActions
  openDrawer,

  // #ownProps
  items,
  allowCreate,
  name,
  ...props
}: CustomerSelectRootProps) {
  // Maybe inject create new item props to suggest component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : null;
  const { setFieldValue } = useFormikContext();

  // Creates autofill listener once the quick customer drawer submit the form.
  const autofillRef = useCreateAutofillListener(
    (payload: { customerId?: number }) => {
      setFieldValue(name, payload.customerId);
    },
  );
  // Handles the create item click.
  const handleCreateItemClick = (item: CreatedItem) => {
    const displayName = item.name;
    openDrawer(DRAWERS.QUICK_CREATE_CUSTOMER, { autofillRef, displayName });
  };

  return (
    <FSelect
      name={name}
      items={items}
      textAccessor={'displayName'}
      labelAccessor={'formattedBalance'}
      valueAccessor={'id'}
      popoverProps={{ minimal: true, usePortal: true, inline: false }}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      onCreateItemSelect={handleCreateItemClick}
      {...props}
    />
  );
}

export const CustomersSelect = R.compose(withDrawerActions)(CustomerSelectRoot);
