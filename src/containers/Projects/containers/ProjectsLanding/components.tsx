// @ts-nocheck
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
import {
  Icon,
  FormatDate,
  Can,
  Choose,
  If,
  FormattedMessage as T,
} from '@/components';
import { ProjectAction, AbilitySubject } from '@/constants/abilityOption';
import { safeCallback, firstLettersArgs, calculateStatus } from '@/utils';

/**
 * project status.
 */
export function ProjectStatus({ row }) {
  return (
    <ProjectStatusRoot>
      <ProjectStatusTaskAmount>{row.cost_estimate}</ProjectStatusTaskAmount>
      <ProjectProgressBar
        animate={false}
        stripes={false}
        intent={Intent.PRIMARY}
        value={calculateStatus(100, row.cost_estimate)}
      />
    </ProjectStatusRoot>
  );
}

/**
 * status accessor.
 */
export const StatusAccessor = (row) => {
  return (
    <Choose>
      <Choose.When condition={row.status_formatted === 'InProgress'}>
        <ProjectStatus row={row} />
      </Choose.When>
      <Choose.When condition={row.status_formatted === 'Closed'}>
        <StatusTagWrap>
          <Tag minimal={true} intent={Intent.SUCCESS} round={true}>
            {row.status_formatted}
          </Tag>
        </StatusTagWrap>
      </Choose.When>
      <Choose.Otherwise>
        <StatusTagWrap>
          <Tag minimal={true} round={true}>
            <T id={'draft'} />
          </Tag>
        </StatusTagWrap>
      </Choose.Otherwise>
    </Choose>
  );
};

/**
 * Avatar cell.
 */
export const AvatarCell = ({ row: { original }, size }) => (
  <span className="avatar" data-size={size}>
    {firstLettersArgs(original?.contact_display_name, original?.name)}
  </span>
);

/**
 * Table actions cell.
 */
export const ActionsMenu = ({
  row: { original },
  payload: { onEdit, onDelete, onViewDetails, onNewTask, onStatus },
}) => (
  <Menu>
    <MenuItem
      icon={<Icon icon="reader-18" />}
      text={intl.get('view_details')}
      onClick={safeCallback(onViewDetails, original)}
    />
    <Can I={ProjectAction.Edit} a={AbilitySubject.Project}>
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('projects.action.edit_project')}
        onClick={safeCallback(onEdit, original)}
      />
    </Can>
    <Can I={ProjectAction.Create} a={AbilitySubject.Project}>
      <MenuItem
        icon={<Icon icon="plus" />}
        text={intl.get('projects.action.new_task')}
        onClick={safeCallback(onNewTask, original)}
      />
    </Can>
    <Can I={ProjectAction.View} a={AbilitySubject.Project}>
      <MenuItem text={'Status'} icon={<Icon icon="plus" />}>
        <If condition={original.status !== 'InProgress'}>
          <MenuItem
            text={'InProgress'}
            onClick={safeCallback(onStatus, original)}
          />
        </If>
        <If condition={original.status !== 'Closed'}>
          <MenuItem
            text={'Closed'}
            onClick={safeCallback(onStatus, original)}
          />
        </If>
      </MenuItem>
    </Can>
    <Can I={ProjectAction.Delete} a={AbilitySubject.Project}>
      <MenuDivider />
      <MenuItem
        text={intl.get('projects.action.delete_project')}
        icon={<Icon icon="trash-16" iconSize={16} />}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
      />
    </Can>
  </Menu>
);

/**
 * Projects accessor.
 */
export const ProjectsAccessor = (row) => (
  <ProjectItemsWrap>
    <ProjectItemsHeader>
      <ProjectItemContactName>
        {row.contact_display_name}
      </ProjectItemContactName>
      <ProjectItemProjectName>{row.name}</ProjectItemProjectName>
    </ProjectItemsHeader>
    <ProjectItemDescription>
      <FormatDate value={row.deadline_formatted} />
      {intl.get('projects.label.cost_estimate', {
        value: row.cost_estimate_formatted,
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
        width: 140,
        className: 'name',
        clickable: true,
      },
      {
        id: 'status',
        Header: '',
        accessor: StatusAccessor,
        width: 40,
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
  margin-right: 0.5rem;
  flex-direction: row-reverse;
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
    max-width: 110px;
    &,
    .bp3-progress-meter {
      border-radius: 0;
    }
  }
`;

const StatusTagWrap = styled.div`
  display: flex;
  justify-content: center;
  .tag {
    min-width: 65px;
    text-align: center;
  }
`;
