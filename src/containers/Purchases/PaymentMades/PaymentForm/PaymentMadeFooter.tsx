// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Row, Col, Paper } from '@/components';
import { PaymentMadeFormFooterLeft } from './PaymentMadeFormFooterLeft';
import { PaymentMadeFormFooterRight } from './PaymentMadeFormFooterRight';

/**
 * Payment made form footer.
 */
export default function PaymentMadeFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <PaymentReceiveFooterPaper>
        <Row>
          <Col md={8}>
            <PaymentMadeFormFooterLeft />
          </Col>

          <Col md={4}>
            <PaymentMadeFormFooterRight />
          </Col>
        </Row>
      </PaymentReceiveFooterPaper>
    </div>
  );
}

const PaymentReceiveFooterPaper = styled(Paper)`
  padding: 20px;
`;
