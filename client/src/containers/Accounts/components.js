import React from 'react';
import {
  Position,
  Classes,
  Tooltip,
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';
import { Icon, Money, If, Choose } from 'components';

export function NormalCell({ cell }) {
  const { formatMessage } = useIntl();

  const account = cell.row.original;
  const normal = account?.type?.normal || '';
  const arrowDirection = normal === 'credit' ? 'down' : 'up';

  return (
    <Tooltip
      className={Classes.TOOLTIP_INDICATOR}
      content={formatMessage({ id: normal })}
      position={Position.RIGHT}
      hoverOpenDelay={100}
    >
      <Icon icon={`arrow-${arrowDirection}`} />
    </Tooltip>
  );
}

export function BalanceCell({ cell }) {
  const account = cell.row.original;

  return account.amount ? (
    <span>
      <Money amount={account.amount} currency={'USD'} />
    </span>
  ) : (
    <span class="placeholder">—</span>
  );
}

export function InactiveSemafro() {
  return (
    <Tooltip
      content={<T id="inactive" />}
      className={classNames(
        Classes.TOOLTIP_INDICATOR,
        'bp3-popover-wrapper--inactive-semafro',
      )}
      position={Position.TOP}
      hoverOpenDelay={250}
    >
      <div className="inactive-semafro"></div>
    </Tooltip>
  );
}

export function AccountNameAccessor(row) {
  return (
    <>
      <Choose>
        <Choose.When condition={!!row.description}>
          <Tooltip
            className={classNames(
              Classes.TOOLTIP_INDICATOR,
              'bp3-popover-wrapper--account-desc',
            )}
            content={row.description}
            position={Position.RIGHT_TOP}
            hoverOpenDelay={500}
          >
            {row.name}
          </Tooltip>
        </Choose.When>

        <Choose.Otherwise>{row.name}</Choose.Otherwise>
      </Choose>

      <If condition={!row.active}>
        <InactiveSemafro />
      </If>
    </>
  );
}
