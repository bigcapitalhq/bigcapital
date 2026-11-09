import { x } from '@xstyled/emotion';
import React from 'react';
import { UploadAttachmentButton } from '../../../Attachments/UploadAttachmentButton';
import { InvoiceFormFooterLeft } from './InvoiceFormFooterLeft';
import { InvoiceFormFooterRight } from './InvoiceFormFooterRight';
import { Row, Col, Paper } from '@/components';

export function InvoiceFormFooter() {
  return (
    <x.div mt={'20px'} px={'32px'} pb={'20px'} flex={1}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <InvoiceFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <InvoiceFormFooterRight />
          </Col>
        </Row>
      </Paper>
    </x.div>
  );
}
