// @ts-nocheck
import React from 'react';
import { x } from '@xstyled/emotion';
import { Paper, Row, Col } from '@/components';
import { BillFormFooterLeft } from './BillFormFooterLeft';
import { BillFormFooterRight } from './BillFormFooterRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

// Bill form floating actions.
export default function BillFormFooter() {
  return (
    <x.div mt={'20px'} px={'32px'} pb={'20px'} flex={1}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <BillFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <BillFormFooterRight />
          </Col>
        </Row>
      </Paper>
    </x.div>
  );
}
