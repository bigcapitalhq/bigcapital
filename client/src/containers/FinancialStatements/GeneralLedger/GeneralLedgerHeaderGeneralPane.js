import React from 'react';
import {
  FormGroup,
  Classes,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';

import { AccountsMultiSelect, Row, Col } from 'components';

import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialAccountsFilter from '../FinancialAccountsFilter';

import { filterAccountsOptions } from './common';
import { useGeneralLedgerContext } from './GeneralLedgerProvider'

/**
 * General ledger (GL) - Header - General panel.
 */
export default function GeneralLedgerHeaderGeneralPane() {
  const { accounts } = useGeneralLedgerContext();

  return (
    <div>
      <FinancialStatementDateRange />
      <FinancialAccountsFilter
        items={filterAccountsOptions}
        initialSelectedItem={'all-accounts'}
      />
      <Row>
        <Col xs={4}>
          <FormGroup
            label={<T id={'specific_accounts'} />}
            className={classNames('form-group--select-list', Classes.FILL)}
          >
            <AccountsMultiSelect accounts={accounts} />
          </FormGroup>
        </Col>
      </Row>

      <RadiosAccountingBasis key={'basis'} />
    </div>
  );
}