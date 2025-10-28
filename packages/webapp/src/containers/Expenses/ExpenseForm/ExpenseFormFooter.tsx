// @ts-nocheck
import React from 'react';
import { x } from '@xstyled/emotion';
import { Row, Col, Paper } from '@/components';
import { ExpenseFormFooterLeft } from './ExpenseFormFooterLeft';
import { ExpenseFormFooterRight } from './ExpenseFormFooterRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

export default function ExpenseFormFooter() {
  return (
    <x.div mt={'20px'} px={'32px'} pb={'20px'} flex={1}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <ExpenseFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <ExpenseFormFooterRight />
          </Col>
        </Row>
      </Paper>
    </x.div>
  );
}
