// @ts-nocheck
import React from 'react';
import { x } from '@xstyled/emotion';

import { Row, Col, Paper, Box } from '@/components';
import { PaymentReceiveFormFootetLeft } from './PaymentReceiveFormFootetLeft';
import { PaymentReceiveFormFootetRight } from './PaymentReceiveFormFootetRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

/**
 * Payment received form footer.
 */
export default function PaymentReceiveFormFooter() {
  return (
    <Box mt={'20px'} px={'32px'} pb={'20px'} flex={1}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <PaymentReceiveFormFootetLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <PaymentReceiveFormFootetRight />
          </Col>
        </Row>
      </Paper>
    </Box>
  );
}
