import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/common/classes';
import { Row, Col, Paper } from '@/components';
import { ExpenseFormFooterLeft } from './ExpenseFormFooterLeft';
import { ExpenseFormFooterRight } from './ExpenseFormFooterRight';

export default function ExpenseFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <ExpensesFooterPaper>
        <Row>
          <Col md={8}>
            <ExpenseFormFooterLeft />
          </Col>

          <Col md={4}>
            <ExpenseFormFooterRight />
          </Col>
        </Row>
      </ExpensesFooterPaper>
    </div>
  );
}

const ExpensesFooterPaper = styled(Paper)`
  padding: 20px;
`;
