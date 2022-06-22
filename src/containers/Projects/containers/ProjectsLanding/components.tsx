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
      <ProjectProgressBar
        animate={false}
        stripes={false}
        // intent={Intent.PRIMARY}
        value={calculateStatus(project.task_amount, project.cost_estimate)}
      />
      <ProjectStatusTaskAmount>{project.task_amount}</ProjectStatusTaskAmount>
    </ProjectStatusRoot>
  );
}

/**
 * status accessor.
 */
export const StatusAccessor = (project) => {
  return (
    <Choose>
      <Choose.When condition={project.is_process}>
        <ProjectStatus project={project} />
      </Choose.When>
      <Choose.When condition={project.is_closed}>
        <Tag minimal={true} intent={Intent.SUCCESS} round={true}>
          <T id={'closed'} />
        </Tag>
      </Choose.When>
      <Choose.When condition={project.is_draft}>
        <Tag round={true} minimal={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.When>
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
        Header: '',
        accessor: ProjectsAccessor,
        width: 200,
        className: 'name',
        clickable: true,
      },
      {
        id: 'status',
        Header: '',
        accessor: StatusAccessor,
        width: 50,
        className: 'status',
      },
    ],
    [],
  );
};

const ProjectItemsWrap = styled.div``;

const ProjectItemsHeader = styled.div`
  display: flex;
  align-items: baseline;
  line-height: 1.3rem;
`;

const ProjectItemContactName = styled.div`
  font-weight: 500;
  padding-right: 4px;
`;
const ProjectItemProjectName = styled.div``;

const ProjectItemDescription = styled.div`
  display: inline-block;
  font-size: 13px;
  opacity: 0.75;
  margin-top: 0.2rem;
  line-height: 1;
`;

const ProjectStatusRoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* margin-right: 0.8rem; */
  /* flex-direction: row-reverse; */
`;
const ProjectStatusTaskAmount = styled.div`
  text-align: right;
  font-weight: 400;
  line-height: 1.5rem;
  margin-left: 20px;
`;

const ProjectProgressBar = styled(ProgressBar)`
  &.bp3-progress-bar {
    display: block;
    flex-shrink: 0;
    height: 3px;
    max-width: 100px;
    &,
    .bp3-progress-meter {
      border-radius: 0;
    }
  }
`;
