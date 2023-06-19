// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Icon, If, Choose, FormattedMessage as T } from '@/components';
import { Menu, MenuItem, Intent, ProgressBar } from '@blueprintjs/core';
import { safeCallback } from '@/utils';

/**
 * Table actions cell.
 */
export function ActionsMenu({
  payload: { onEdit, onDelete },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('project_task.action.edit_task')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        text={intl.get('project_task.action.delete_task')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 *
 * @returns
 */
function TaskChargeType({ values: { charge_type, rate } }) {
  return (
    <Choose>
      <Choose.When condition={charge_type === 'TIME'}>
        <T id={'project_task.rate'} values={{ rate: rate }} />
      </Choose.When>
      <Choose.When condition={charge_type === 'FIXED'}>
        <T id={'project_task.fixed_price'} />
      </Choose.When>
      <Choose.When condition={charge_type === 'NON_CHARGABLE'}>
        <T id={'project_task.non_chargable'} />
      </Choose.When>
    </Choose>
  );
}

export function TaskAccessor(task) {
  return (
    <TaskRoot>
      <TaskHeader>
        <TaskTitle>{task.name}</TaskTitle>
      </TaskHeader>
      <TaskContent>
        <TaskChargeType values={task} />

        <TaskDescription>
          {task.estimate_hours &&
            intl.get('project_task.estimate_hours', {
              estimate_hours: task.estimate_hours,
            })}
        </TaskDescription>
      </TaskContent>
    </TaskRoot>
  );
}

export function TaskTimeAccessor(task) {
  return (
    <TaskTimeRoot>
      <TaskTimeMinutesRoot>
        <TaskTimeMinutes>00:00</TaskTimeMinutes>
        <TaskTimeFull>17h 30m</TaskTimeFull>
      </TaskTimeMinutesRoot>

      <TaskProgressBar
        animate={false}
        stripes={false}
        intent={Intent.NONE}
        value={100}
      />
    </TaskTimeRoot>
  );
}

const TaskTimeRoot = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
`;

const TaskTimeMinutesRoot = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  text-align: right;
`;

const TaskTimeMinutes = styled.div``;
const TaskTimeFull = styled.div`
  font-size: 12px;
  color: #5b5c62;
`;

const TaskProgressBar = styled(ProgressBar)`
  &.bp3-progress-bar {
    display: block;
    flex-shrink: 0;
    height: 4px;
    max-width: 150px;
    &,
    .bp3-progress-meter {
      border-radius: 4px;
    }
  }
`;

const TaskRoot = styled.div``;
const TaskHeader = styled.div`
  display: flex;
  align-items: baseline;
  flex-flow: wrap;
`;
const TaskTitle = styled.span`
  font-weight: 600;
`;
const TaskContent = styled.div`
  display: block;
  white-space: nowrap;
  font-size: 13px;
  opacity: 0.75;
  margin-top: 0.25rem;
`;
const TaskDescription = styled.span`
  margin: 0.3rem;
`;
