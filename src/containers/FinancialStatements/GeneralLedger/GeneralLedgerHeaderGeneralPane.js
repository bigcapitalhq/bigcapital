import React from 'react';
import { FormGroup, Classes } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import classNames from 'classnames';

import { AccountsMultiSelect, Row, Col } from 'components';

import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialAccountsFilter from '../FinancialAccountsFilter';
import { GLHeaderGeneralPanelProvider } from './GLHeaderGeneralPaneProvider';

import { filterAccountsOptions } from './common';
import { useGLGeneralPanelContext } from './GLHeaderGeneralPaneProvider';

/**
 * General ledger (GL) - Header - General panel.
 */
export default function GLHeaderGeneralPane() {
  return (
    <GLHeaderGeneralPanelProvider>
      <GLHeaderGeneralPaneContent />
    </GLHeaderGeneralPanelProvider>
  );
}

/**
 * General ledger (GL) - Header - General panel - content.
 */
function GLHeaderGeneralPaneContent() {
  const { accounts } = useGLGeneralPanelContext();

  return (
    <React.Fragment>
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
            <AccountsMultiSelect items={accounts} />
          </FormGroup>
        </Col>
      </Row>

      <RadiosAccountingBasis key={'basis'} />
    </React.Fragment>
  );
}
