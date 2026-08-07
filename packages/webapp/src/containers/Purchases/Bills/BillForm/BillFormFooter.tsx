import { x } from '@xstyled/emotion';
import React from 'react';
import { BillFormFooterLeft } from './BillFormFooterLeft';
import { BillFormFooterRight } from './BillFormFooterRight';
import { Paper, Row, Col } from '@/components';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

// Bill form floating actions.
export function BillFormFooter() {
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
