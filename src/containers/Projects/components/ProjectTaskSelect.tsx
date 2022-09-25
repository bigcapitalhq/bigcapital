// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem, Button } from '@blueprintjs/core';
import { FSelect } from '@/components';

/**
 *
 * @param {*} query
 * @param {*} task
 * @param {*} _index
 * @param {*} exactMatch
 * @returns
 */
const taskItemPredicate = (query, task, _index, exactMatch) => {
  const normalizedTitle = task.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${task.name}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};

/**
 *
 * @param {*} task
 * @param {*} param1
 * @returns
 */
const taskItemRenderer = (task, { handleClick, modifiers, query }) => {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={task.id}
      onClick={handleClick}
      text={task.name}
    />
  );
};

const taskSelectProps = {
  itemPredicate: taskItemPredicate,
  itemRenderer: taskItemRenderer,
  valueAccessor: 'id',
  labelAccessor: 'name',
};

/**
 * 
 * @param param0 
 * @returns 
 */
export function ProjectTaskSelect({ tasks, ...rest }) {
  return (
    <FSelect
      items={tasks}
      {...taskSelectProps}
      {...rest}
      input={TaskSelectButton}
    />
  );
}

function TaskSelectButton({ label }) {
  return <Button text={label ? label : intl.get('choose_a_task')} />;
}
