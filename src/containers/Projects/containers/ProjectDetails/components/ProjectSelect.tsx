import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem, Button } from '@blueprintjs/core';
import { FSelect } from 'components';

/**
 *
 * @param {*} query
 * @param {*} project
 * @param {*} _index
 * @param {*} exactMatch
 * @returns
 */
const projectItemPredicate = (query, project, _index, exactMatch) => {
  const normalizedTitle = project.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${project.name}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};

/**
 *
 * @param {*} project
 * @param {*} param1
 * @returns
 */
const projectItemRenderer = (project, { handleClick, modifiers, query }) => {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={project.id}
      onClick={handleClick}
      text={project.name}
    />
  );
};

const projectSelectProps = {
  itemPredicate: projectItemPredicate,
  itemRenderer: projectItemRenderer,
  valueAccessor: 'id',
  labelAccessor: 'name',
};

export function ProjectSelect({ projects, ...rest }) {
  return (
    <FSelect
      items={projects}
      {...projectSelectProps}
      {...rest}
      input={ProjectSelectButton}
    />
  );
}

function ProjectSelectButton({ label }) {
  return <Button text={label ? label : intl.get('find_or_choose_a_project')} />;
}
