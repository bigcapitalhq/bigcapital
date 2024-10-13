// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Row, Col, Paper } from '@/components';
import { PaymentMadeFormFooterLeft } from './PaymentMadeFormFooterLeft';
import { PaymentMadeFormFooterRight } from './PaymentMadeFormFooterRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

/**
 * Payment made form footer.
 */
export default function PaymentMadeFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <PaymentMadeFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <PaymentMadeFormFooterRight />
          </Col>
        </Row>
      </Paper>
    </div>
  );
}
