import React from 'react';
import {
  FormGroup,
  Classes,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { compose } from 'redux';

import { AccountsMultiSelect, Row, Col } from 'components';

import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialAccountsFilter from '../FinancialAccountsFilter';

import withAccounts from 'containers/Accounts/withAccounts';

import { filterAccountsOptions } from './common';

/**
 * General ledger (GL) - Header - General panel.
 */
function GeneralLedgerHeaderGeneralPane({
  // #withAccounts
  accountsList,
}) {
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
            <AccountsMultiSelect accounts={accountsList} />
          </FormGroup>
        </Col>
      </Row>

      <RadiosAccountingBasis key={'basis'} />
    </div>
  );
}

export default compose(withAccounts(({ accountsList }) => ({ accountsList })))(
  GeneralLedgerHeaderGeneralPane,
);
