import { Classes } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { FinancialStatementDateRange } from '../FinancialStatementDateRange';
import { FinancialStatementsFilter } from '../FinancialStatementsFilter';
import { RadiosAccountingBasis } from '../RadiosAccountingBasis';
import { filterAccountsOptions } from './common';
import { useGLGeneralPanelContext } from './GLHeaderGeneralPaneProvider';
import { GLHeaderGeneralPanelProvider } from './GLHeaderGeneralPaneProvider';
import { AccountsMultiSelect, Row, Col, FFormGroup } from '@/components';

/**
 * General ledger (GL) - Header - General panel.
 */
export function GLHeaderGeneralPane() {
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

  if (!accounts) {
    return null;
  }

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
            label={intl.get('specific_accounts')}
            name={'accountsIds'}
            className={Classes.FILL}
          >
            <AccountsMultiSelect name="accountsIds" items={accounts} />
          </FFormGroup>
        </Col>
      </Row>

      <RadiosAccountingBasis key={'basis'} />
    </React.Fragment>
  );
}
