import React from 'react';
import {
  PopoverInteractionKind,
  Tooltip,
  MenuItem,
  Position,
  FormGroup,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { FastField } from 'formik';

import { CLASSES } from 'common/classes';
import { Col, Row, ListSelect, MODIFIER } from 'components';
import { filterAccountsOptions } from './common';


export default function FinancialAccountsFilter({ ...restProps }) {
  const SUBMENU_POPOVER_MODIFIERS = {
    flip: { boundariesElement: 'viewport', padding: 20 },
    offset: { offset: '0, 10' },
    preventOverflow: { boundariesElement: 'viewport', padding: 40 },
  };

  const filterAccountRenderer = (item, { handleClick, modifiers, query }) => {
    return (
      <Tooltip
        interactionKind={PopoverInteractionKind.HOVER}
        position={Position.RIGHT_TOP}
        content={item.hint}
        modifiers={SUBMENU_POPOVER_MODIFIERS}
        inline={true}
        minimal={true}
        className={MODIFIER.SELECT_LIST_TOOLTIP_ITEMS}
      >
        <MenuItem text={item.name} key={item.key} onClick={handleClick} />
      </Tooltip>
    );
  };

  return (
    <Row>
      <Col xs={4}>
        <FastField name={'accountsFilter'}>
          {({ form: { setFieldValue }, field: { value } }) => (
            <FormGroup
              label={<T id={'filter_accounts'} />}
              className="form-group--select-list bp3-fill"
              inline={false}
            >
              <ListSelect
                items={filterAccountsOptions}
                itemRenderer={filterAccountRenderer}
                popoverProps={{ minimal: true }}
                filterable={false}
                selectedItem={value}
                selectedItemProp={'key'}
                textProp={'name'}
                onItemSelect={(item) => {
                  setFieldValue('accountsFilter', item.key);
                }}
                className={classNames(CLASSES.SELECT_LIST_FILL_POPOVER)}
                {...restProps}
              />
            </FormGroup>
          )}
        </FastField>
      </Col>
    </Row>
  );
}
