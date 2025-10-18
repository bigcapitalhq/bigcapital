// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { x } from '@xstyled/emotion';

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
    <x.div mt={'20px'} px={'32px'} pb={'20px'} flex={1}>
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
    </x.div>
  );
}
