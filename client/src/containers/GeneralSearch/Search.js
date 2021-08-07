import React from 'react';
import { Intent, Spinner } from '@blueprintjs/core';
import {
  UniversalSearch,
  ListSelect,
  If,
  FormattedMessage as T,
} from 'components';
import { defaultTo } from 'lodash';
import intl from 'react-intl-universal';
import { useAccounts } from 'hooks/query';
import UniversalSearchOptions from 'common/universalSearchOptions';

import { compose } from 'utils';

import withSearch from 'containers/GeneralSearch/withSearch';

function Search({ globalSearchShow }) {
  const [query, setQuery] = React.useState();
  const [labelState, setLabelState] = React.useState();

  const { data: accounts, isFetching: isAccountsFetching } = useAccounts({
    search_keyword: query,
  });

  const handleClick = (placeholder) => {
    setLabelState(placeholder);
  };

  const MenuSelectType = (
    <div style={{ display: 'flex' }}>
      <If condition={isAccountsFetching}>
        <Spinner tagName="div" intent={Intent.NONE} size={20} value={null} />
      </If>
      <ListSelect
        items={UniversalSearchOptions}
        onItemSelect={(holder) => handleClick(holder)}
        filterable={false}
        selectedItem={labelState?.name}
        selectedItemProp={'name'}
        textProp={'name'}
        defaultText={intl.get('type')}
        popoverProps={{ minimal: false, captureDismiss: true }}
        buttonProps={{
          minimal: true,
        }}
      />
    </div>
  );

  return (
    <UniversalSearch
      results={accounts}
      isOpen={globalSearchShow}
      onQueryChange={(q) => setQuery(q)}
      inputProps={{
        rightElement: MenuSelectType,
        placeholder: `${defaultTo(labelState?.placeholder, '')}`,
      }}
    />
  );
}

export default compose(withSearch)(Search);
