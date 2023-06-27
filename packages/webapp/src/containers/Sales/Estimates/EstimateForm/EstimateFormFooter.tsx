// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Row, Col, Paper } from '@/components';
import { EstimateFormFooterLeft } from './EstimateFormFooterLeft';
import { EstimateFormFooterRight } from './EstimateFormFooterRight';

/**
 * Estimate form footer.
 */
export default function EstimateFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <EstimateFooterPaper>
        <Row>
          <Col md={8}>
            <EstimateFormFooterLeft />
          </Col>

          <Col md={4}>
            <EstimateFormFooterRight />
          </Col>
        </Row>
      </EstimateFooterPaper>
    </div>
  );
}

const EstimateFooterPaper = styled(Paper)`
  padding: 20px;
`;
