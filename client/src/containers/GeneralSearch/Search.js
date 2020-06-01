import React from 'react';
import { Omnibar } from '@blueprintjs/select';
import { MenuItem } from '@blueprintjs/core';
import { compose } from 'utils';
import withSearch from 'containers/GeneralSearch/withSearch';

function Search({
  resultSearch,
  globalSearchShow,
  openGlobalSearch,
  closeGlobalSearch,
}) {
  const items = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
  ];

  const renderSearch = (search, { handleClick }) => (
    <MenuItem
      key={search.year}
      text={search.title}
      label={search.title}
      onClick={handleClick}
    />
  );

  return (
    <div>
      <Omnibar
        className={'navbar-omnibar'}
        isOpen={globalSearchShow}
        noResults={<MenuItem disabled={true} text="No results." />}
        onClose={() => closeGlobalSearch(false)}
        resetOnSelect={true}
        itemRenderer={renderSearch}
        items={items}
        // onItemSelect={onItemsSelect()}
      />
    </div>
  );
}

export default compose(withSearch)(Search);
