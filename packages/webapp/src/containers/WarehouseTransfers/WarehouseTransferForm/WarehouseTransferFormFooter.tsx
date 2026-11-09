import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { WarehouseTransferFormFooterLeft } from './WarehouseTransferFormFooterLeft';
import { Paper, Row, Col } from '@/components';
import { CLASSES } from '@/constants/classes';

export function WarehouseTransferFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <WarehouseTransferFormFooterLeft />
          </Col>
        </Row>
      </Paper>
    </div>
  );
}
