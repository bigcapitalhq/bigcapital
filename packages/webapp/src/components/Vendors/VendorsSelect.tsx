import { useFormikContext } from 'formik';
import * as R from 'ramda';
import { FSelect } from '../Forms';
import { createNewItemFromQuery, createNewItemRenderer } from './utils';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useCreateAutofillListener } from '@/hooks/state/autofill';

interface VendorsSelectRootProps extends WithDrawerActionsProps {
  name: string;
  items: unknown[];
  allowCreate?: boolean;
  [key: string]: unknown;
}

interface CreatedItem {
  name: string;
}

/**
 * Vendor select.
 */
function VendorsSelectRoot({
  // #withDrawerActions
  openDrawer,

  // #ownProps
  name,
  items,
  allowCreate,

  ...restProps
}: VendorsSelectRootProps) {
  // Maybe inject create new item props to suggest component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : null;
  const { setFieldValue } = useFormikContext();

  // Creates a new autofill listener once the quick vendor drawer submits the form.
  const autofillRef = useCreateAutofillListener(
    (payload: { vendorId?: number }) => {
      setFieldValue(name, payload.vendorId);
    },
  );

  // Handles the create item click.
  const handleCreateItemClick = (item: CreatedItem) => {
    openDrawer(DRAWERS.QUICK_WRITE_VENDOR, {
      autofillRef,
      displayName: item.name,
    });
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
      {...restProps}
    />
  );
}

export const VendorsSelect = R.compose(withDrawerActions)(VendorsSelectRoot);
