// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Row, Col, Paper } from '@/components';
import { PaymentReceiveFormFootetLeft } from './PaymentReceiveFormFootetLeft';
import { PaymentReceiveFormFootetRight } from './PaymentReceiveFormFootetRight';

/**
 * Payment receive form footer.
 */
export default function PaymentReceiveFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <PaymentReceiveFooterPaper>
        <Row>
          <Col md={8}>
            <PaymentReceiveFormFootetLeft />
          </Col>

          <Col md={4}>
            <PaymentReceiveFormFootetRight />
          </Col>
        </Row>
      </PaymentReceiveFooterPaper>
    </div>
  );
}

const PaymentReceiveFooterPaper = styled(Paper)`
  padding: 20px;
`;
