// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Row, Col, Paper } from '@/components';
import { PaymentReceiveFormFootetLeft } from './PaymentReceiveFormFootetLeft';
import { PaymentReceiveFormFootetRight } from './PaymentReceiveFormFootetRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

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
            <UploadAttachmentButton />
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
