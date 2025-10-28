// @ts-nocheck
import React from 'react';

import { Row, Col, Paper, Stack } from '@/components';
import { CreditNoteFormFooterLeft } from './CreditNoteFormFooterLeft';
import { CreditNoteFormFooterRight } from './CreditNoteFormFooterRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

/**
 * Credit note form footer.
 */
export default function CreditNoteFormFooter() {
  return (
    <Stack mt={'20px'} px={'32px'} pb={'20px'} flex={1}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <CreditNoteFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <CreditNoteFormFooterRight />
          </Col>
        </Row>
      </Paper>
    </Stack>
  );
}
