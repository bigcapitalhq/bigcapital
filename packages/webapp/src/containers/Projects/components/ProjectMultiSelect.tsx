// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem } from '@blueprintjs/core';
import { FMultiSelect } from '@/components';

/**
 *
 * @param query
 * @param project
 * @param _index
 * @param exactMatch
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
 * @param project
 * @param param1
 * @param param2
 * @returns
 */
const projectItemRenderer = (
  project,
  { handleClick, modifiers, query },
  { isSelected },
) => {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      icon={isSelected ? 'tick' : 'blank'}
      key={project.id}
      text={project.name}
      onClick={handleClick}
    />
  );
};

const projectSelectProps = {
  itemPredicate: projectItemPredicate,
  itemRenderer: projectItemRenderer,
  valueAccessor: (item) => item.id,
  labelAccessor: (item) => item.name,
  tagRenderer: (item) => item.name,
};

/**
 * projects multi select.
 * @param param0
 * @returns {JSX.Element}
 */
export function ProjectMultiSelect({
  projects,

  ...rest
}) {
  return (
    <FMultiSelect
      items={projects}
      placeholder={intl.get('projects_multi_select.placeholder')}
      popoverProps={{ minimal: true }}
      {...projectSelectProps}
      {...rest}
    />
  );
}
