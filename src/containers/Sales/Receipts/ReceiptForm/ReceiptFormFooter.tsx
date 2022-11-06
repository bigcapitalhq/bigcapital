// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Paper, Row, Col } from '@/components';
import { ReceiptFormFooterLeft } from './ReceiptFormFooterLeft';
import { ReceiptFormFooterRight } from './ReceiptFormFooterRight';

export default function ReceiptFormFooter({}) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <ReceiptFooterPaper>
        <Row>
          <Col md={8}>
            <ReceiptFormFooterLeft />
          </Col>

          <Col md={4}>
            <ReceiptFormFooterRight />
          </Col>
        </Row>
      </ReceiptFooterPaper>
    </div>
  );
}

const ReceiptFooterPaper = styled(Paper)`
  padding: 20px;
`;
