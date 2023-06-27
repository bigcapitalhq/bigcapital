// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { Menu, MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import { FormattedMessage as T } from '@/components';

import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { firstLettersArgs } from '@/utils';

/**
 * project suggest field.
 * @returns
 */
export function ProjectSuggestField({
  projects,
  initialProjectId,
  selectedProjectId,
  defaultSelectText = intl.get('select_project'),
  popoverFill = false,
  onProjectSelected,
  ...suggestProps
}) {
  const initialProject = React.useMemo(
    () => projects.find((b) => b.id === initialProjectId),
    [initialProjectId, projects],
  );

  const [selectedProject, setSelectedProject] = React.useState(
    initialProject || null,
  );

  React.useEffect(() => {
    if (typeof selectedProjectId !== 'undefined') {
      const project = selectedProjectId
        ? projects.find((a) => a.id === selectedProjectId)
        : null;
      setSelectedProject(project);
    }
  }, [selectedProjectId, projects, setSelectedProject]);

  /**
   * @param {*} project
   * @param {*} param1
   * @returns {JSX.Element}
   */
  const projectsItemRenderer = (project, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        icon={<AvatarSelect text={project} />}
        disabled={modifiers.disabled}
        key={project.id}
        text={project.name}
        onClick={handleClick}
      />
    );
  };

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
      return (
        `${project.name}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0
      );
    }
  };

  /**
   *
   * @param {*} project
   * @returns
   */
  const projectItemSelect = React.useCallback(
    (project) => {
      if (project.id) {
        setSelectedProject({ ...project });
        onProjectSelected && onProjectSelected(project);
      }
    },
    [setSelectedProject, onProjectSelected],
  );

  /**
   *
   * @param {*} inputValue
   * @returns
   */
  const projectInputValueRenderer = (inputValue) => {
    if (inputValue) {
      return inputValue.name.toString();
    }
    return '';
  };

  return (
    <Suggest
      items={projects}
      noResults={<MenuItem disabled={true} text={<T id={'no_accounts'} />} />}
      itemRenderer={projectsItemRenderer}
      itemPredicate={projectsItemPredicate}
      onItemSelect={projectItemSelect}
      selectedItem={selectedProject}
      inputProps={{ placeholder: defaultSelectText }}
      resetOnClose={true}
      fill={true}
      popoverProps={{ minimal: true, boundary: 'window' }}
      inputValueRenderer={projectInputValueRenderer}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      {...suggestProps}
    />
  );
}

const AvatarSelect = ({ text }) => {
  return <AvatarContent>{firstLettersArgs(text?.name)}</AvatarContent>;
};

const AvatarContent = styled.div`
  display: inline-block;
  background: #adbcc9;
  text-align: center;
  font-weight: 400;
  color: #fff;
  height: 22px;
  width: 22px;
  line-height: 22px;
  font-size: 12px;
`;
