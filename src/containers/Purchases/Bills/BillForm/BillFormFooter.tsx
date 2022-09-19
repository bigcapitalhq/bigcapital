// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Paper, Row, Col } from '@/components';
import { BillFormFooterLeft } from './BillFormFooterLeft';
import { BillFormFooterRight } from './BillFormFooterRight';

// Bill form floating actions.
export default function BillFormFooter() {
  return (
    <div class={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <BillFooterPaper>
        <Row>
          <Col md={8}>
            <BillFormFooterLeft />
          </Col>

          <Col md={4}>
            <BillFormFooterRight />
          </Col>
        </Row>
      </BillFooterPaper>
    </div>
  );
}

const BillFooterPaper = styled(Paper)`
  padding: 20px;
`;
