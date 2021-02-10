import React from 'react';
import { Position } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { Money, Hint } from 'components';

/**
 * Contact header cell.
 */
export function ContactHeaderCell() {
  return (
    <>
      <T id={'contact'} />
      <Hint
        content={<T id={'contact_column_hint'} />}
        position={Position.LEFT_BOTTOM}
      />
    </>
  );
}

/** 
 * Total text cell renderer.
 */
export const TotalAccountCellRenderer = (chainedComponent) => (props) => {
  if (props.data.length === props.row.index + 1) {
    return <span>{'Total USD'}</span>;
  }
  return chainedComponent(props);
};

/**
 * Total credit/debit cell renderer.
 */
export const TotalCreditDebitCellRenderer = (chainedComponent, type) => (
  props,
) => {
  if (props.data.length === props.row.index + 1) {
    const total = props.data.reduce((total, entry) => {
      const amount = parseInt(entry[type], 10);
      const computed = amount ? total + amount : total;

      return computed;
    }, 0);

    return (
      <span>
        <Money amount={total} currency={'USD'} />
      </span>
    );
  }
  return chainedComponent(props);
};

export const NoteCellRenderer = (chainedComponent) => (props) => {
  if (props.data.length === props.row.index + 1) {
    return '';
  }
  return chainedComponent(props);
};


/**
 * Actions cell renderer.
 */
export const ActionsCellRenderer = ({
    row: { index },
    column: { id },
    cell: { value: initialValue },
    data,
    payload,
  }) => {
    if (data.length <= index + 1) {
      return '';
    }
    const onClickRemoveRole = () => {
      payload.removeRow(index);
    };
    return (
      <Tooltip content={<T id={'remove_the_line'} />} position={Position.LEFT}>
        <Button
          icon={<Icon icon="times-circle" iconSize={14} />}
          iconSize={14}
          className="ml2"
          minimal={true}
          intent={Intent.DANGER}
          onClick={onClickRemoveRole}
        />
      </Tooltip>
    );
  };
  