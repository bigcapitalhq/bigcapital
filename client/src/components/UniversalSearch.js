import React from 'react';

import { Omnibar } from '@blueprintjs/select';
import { MenuItem, Spinner } from '@blueprintjs/core';
import { FormattedMessage as T, Icon, ListSelect } from 'components';

import withSearch from 'containers/GeneralSearch/withSearch';

import { compose } from 'utils';

function UniversalSearch({
  results,
  onClose,

  // withSearch
  globalSearchShow,
  closeGlobalSearch,
  ...props
}) {
  const SearchRenderer = (
    { name, code, amount },
    { handleClick, modifiers, query },
  ) => {
    return (
      <MenuItem
        text={`${name} - ${code}`}
        label={amount}
        onClick={handleClick}
      />
    );
  };

  const handleClose = () => {
    closeGlobalSearch(false);
  };

  return (
    <Omnibar
      className={'navbar--omnibar'}
      items={results}
      itemRenderer={SearchRenderer}
      noResults={<MenuItem disabled={true} text={<T id={'no_results'} />} />}
      resetOnSelect={true}
      onClose={handleClose}
      {...props}
    />
  );
}

export default compose(withSearch)(UniversalSearch);
