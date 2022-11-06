// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Paper, Row, Col } from '@/components';
import { WarehouseTransferFormFooterLeft } from './WarehouseTransferFormFooterLeft';

export default function WarehouseTransferFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <WarehousesTransferFooterPaper>
        <Row>
          <Col md={8}>
            <WarehouseTransferFormFooterLeft />
          </Col>
        </Row>
      </WarehousesTransferFooterPaper>
    </div>
  );
}

const WarehousesTransferFooterPaper = styled(Paper)`
  padding: 20px;
`;
