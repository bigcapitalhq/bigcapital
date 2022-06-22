import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import {
  Menu,
  MenuDivider,
  MenuItem,
  Tag,
  Intent,
  ProgressBar,
} from '@blueprintjs/core';
import { Icon, FormatDate, Choose, FormattedMessage as T } from 'components';
import { safeCallback, firstLettersArgs, calculateStatus } from 'utils';

/**
 * project status.
 */
export function ProjectStatus({ project }) {
  return (
    <ProjectStatusRoot>
      {project.task_amount}
      <ProjectProgressBar
        animate={false}
        intent={Intent.NONE}
        value={calculateStatus(project.task_amount, project.cost_estimate)}
      />
    </ProjectStatusRoot>
  );
}

/**
 * project status accessor.
 */
export const ProjectStatusAccessor = (row) => {
  return (
    <Choose>
      <Choose.When condition={row.is_in_process}>
        <ProjectStatus project={row} />
      </Choose.When>
      <Choose.Otherwise>
        <Tag round={true} minimal={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
};

/**
 * Avatar cell.
 */
export const AvatarCell = ({ row: { original }, size }) => (
  <span className="avatar" data-size={size}>
    {firstLettersArgs(original?.display_name, original?.name)}
  </span>
);

/**
 * Table actions cell.
 */
export const ActionsMenu = ({
  row: { original },
  payload: { onEdit, onDelete, onViewDetails, onNewTask },
}) => (
  <Menu>
    <MenuItem
      icon={<Icon icon="reader-18" />}
      text={intl.get('view_details')}
      onClick={safeCallback(onViewDetails, original)}
    />
    <MenuDivider />
    <MenuItem
      icon={<Icon icon="pen-18" />}
      text={intl.get('projects.action.edit_project')}
      onClick={safeCallback(onEdit, original)}
    />
    <MenuItem
      icon={<Icon icon="plus" />}
      text={intl.get('projects.action.new_task')}
      onClick={safeCallback(onNewTask, original)}
    />
    <MenuDivider />
    <MenuItem
      text={intl.get('projects.action.delete_project')}
      icon={<Icon icon="trash-16" iconSize={16} />}
      intent={Intent.DANGER}
      onClick={safeCallback(onDelete, original)}
    />
  </Menu>
);

/**
 * Projects accessor.
 */
export const ProjectsAccessor = (row) => (
  <ProjectItemsWrap>
    <ProjectItemsHeader>
      <ProjectItemContactName>{row.display_name}</ProjectItemContactName>
      <ProjectItemProjectName>{row.name}</ProjectItemProjectName>
    </ProjectItemsHeader>
    <ProjectItemDescription>
      <FormatDate value={row.deadline} />
      {intl.get('projects.label.cost_estimate', {
        value: row.cost_estimate,
      })}
    </ProjectItemDescription>
  </ProjectItemsWrap>
);

/**
 * Retrieve projects list columns columns.
 */
export const useProjectsListColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'avatar',
        Header: '',
        Cell: AvatarCell,
        className: 'avatar',
        width: 45,
        disableResizing: true,
        disableSortBy: true,
        clickable: true,
      },
      {
        id: 'name',
        Header: 'Project Name',
        accessor: ProjectsAccessor,
        width: 240,
        className: 'name',
        clickable: true,
      },
      {
        id: 'status',
        Header: 'status',
        accessor: ProjectStatusAccessor,
        width: 80,
        className: 'status',
        clickable: true,
      },
    ],
    [],
  );
};

const ProjectItemsWrap = styled.div``;

const ProjectItemsHeader = styled.div`
  display: flex;
  align-items: baseline;
`;

const ProjectItemContactName = styled.div`
  font-weight: 600;
  padding-right: 4px;
`;
const ProjectItemProjectName = styled.div``;

const ProjectItemDescription = styled.div`
  display: inline-block;
  font-size: 13px;
  opacity: 0.75;
  margin-top: 4px;
`;

const ProjectStatusRoot = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  margin: 0 20px;
`;

const ProjectProgressBar = styled(ProgressBar)`
  &.bp3-progress-bar {
    margin-right: 20px;
    flex-shrink: 0;
    height: 3px;
    max-width: 130px;

    &,
    .bp3-progress-meter {
      border-radius: 0;
    }
  }
`;
