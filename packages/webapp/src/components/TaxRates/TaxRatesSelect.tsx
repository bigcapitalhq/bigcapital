// @ts-nocheck
import * as R from 'ramda';
import intl from 'react-intl-universal';
import { FSelect } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { MenuItem } from '@blueprintjs/core';

// Create new account renderer.
const createNewItemRenderer = (query, active, handleClick) => {
  return (
    <MenuItem
      icon="add"
      text={intl.get('list.create', { value: `"${query}"` })}
      active={active}
      onClick={handleClick}
    />
  );
};

// Create new item from the given query string.
const createNewItemFromQuery = (name) => ({ name });

/**
 * Tax rates select field binded with Formik form.
 * @returns {JSX.Element}
 */
function TaxRatesSelectRoot({
  // #withDialogActions
  openDialog,

  // #ownProps
  allowCreate,

  ...restProps
}) {
  // Maybe inject new item props to select component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : null;

  // Handles the create item click.
  const handleCreateItemClick = () => {
    openDialog(DialogsName.TaxRateForm);
  };

  return (
    <FSelect
      valueAccessor={'id'}
      labelAccessor={'code'}
      textAccessor={'name_formatted'}
      popoverProps={{ minimal: true, usePortal: true, inline: false }}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      onCreateItemSelect={handleCreateItemClick}
      {...restProps}
    />
  );
}

export const TaxRatesSelect = R.compose(withDialogActions)(TaxRatesSelectRoot);
