// @ts-nocheck
import React from 'react';
import { x } from '@xstyled/emotion';
import { Paper, Row, Col } from '@/components';
import { ReceiptFormFooterLeft } from './ReceiptFormFooterLeft';
import { ReceiptFormFooterRight } from './ReceiptFormFooterRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

export function ReceiptFormFooter({}) {
  return (
    <x.div mt={'20px'} px={'32px'} pb={'20px'} flex={1}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <ReceiptFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <ReceiptFormFooterRight />
          </Col>
        </Row>
      </Paper>
    </x.div>
  );
}
