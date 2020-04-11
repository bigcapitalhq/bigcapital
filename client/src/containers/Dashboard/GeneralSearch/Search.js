import React, { useEffect, useState } from 'react';
import { Omnibar } from '@blueprintjs/select';
import { MenuItem, Button, Classes } from '@blueprintjs/core';
import { useAsync } from 'react-use';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Icon from 'components/Icon';
import { compose } from 'utils';
import SearchConnect from 'connectors/Search.connect';

function Search({}) {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
  ];

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
  });
  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {},
  });
  const renderSearch = (search, { handleClick, modifiers }) => (
    <MenuItem
      active={modifiers.active}
      key={search.id}
      text={search.name}
      label={search.name}
      onClick={handleClick}
    />
  );

  const filterSearch = (query, search, _index, exactMatch) => {
    // const normalizedTitle = search.toLowerCase();
    // const normalizedQuery = query.toLowerCase();
    // if (exactMatch) {
    //   return normalizedTitle === normalizedQuery;
    // } else {
    //   return `${search} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    // }
    return search;
  };
  const handleClick = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <Button
        className={Classes.MINIMAL}
        icon='home'
        text='Search'
        onClick={handleClick}
      />
      <Omnibar
        isOpen={isOpen}
        noResults={<MenuItem disabled={true} text='No results.' />}
        onClose={handleClose}
        resetOnSelect={true}
        itemRenderer={renderSearch}
        items={items}
        // onItemSelect={}
        itemListPredicate={filterSearch}
        // style={{ position: 'absolute', canter: '50%' }}
      />
    </div>
  );
}

export default compose(SearchConnect)(Search);
