import React from 'react';
import { FormGroup, Classes } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import classNames from 'classnames';

import { AccountMultiSelect, Row, Col } from 'components';
import { FFormGroup } from '../../../components/Forms';

import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import RadiosAccountingBasis from '../RadiosAccountingBasis';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
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

      <Row>
        <Col xs={4}>
          <FinancialStatementsFilter
            items={filterAccountsOptions}
            initialSelectedItem={'with-transactions'}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <FFormGroup
            label={<T id={'specific_accounts'} />}
            name={'accounts'}
            className={Classes.FILL}
          >
            <AccountMultiSelect name="accounts" accounts={accounts} />
          </FFormGroup>
        </Col>
      </Row>

      <RadiosAccountingBasis key={'basis'} />
    </React.Fragment>
  );
}
