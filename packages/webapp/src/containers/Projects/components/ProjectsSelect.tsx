// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem, Button } from '@blueprintjs/core';
import { FSelect } from '@/components';
import { CLASSES } from '@/constants/classes';
import classNames from 'classnames';

/**
 *
 * @param {*} query
 * @param {*} project
 * @param {*} _index
 * @param {*} exactMatch
 * @returns
 */
const projectsItemPredicate = (query, project, _index, exactMatch) => {
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
const projectsItemRenderer = (project, { handleClick, modifiers, query }) => {
  return (
    <MenuItem
      disabled={modifiers.disabled}
      key={project.id}
      onClick={handleClick}
      text={project.name}
    />
  );
};

const projectSelectProps = {
  itemPredicate: projectsItemPredicate,
  itemRenderer: projectsItemRenderer,
  valueAccessor: 'id',
  labelAccessor: 'name',
};

/**
 *
 * @param {*} param0
 * @returns
 */
export function ProjectsSelect({ projects, popoverFill, ...rest }) {
  return (
    <FSelect
      {...projectSelectProps}
      items={projects}
      popoverProps={{ minimal: true, usePortal: !popoverFill }}
      className={classNames('form-group--select-list', {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      {...rest}
    />
  );
}
/**
 *
 * @param {*} param0
 * @returns
 */
export function ProjectSelectButton({ label, ...rest }) {
  return (
    <Button
      text={label ? label : intl.get('find_or_choose_a_project')}
      {...rest}
    />
  );
}
