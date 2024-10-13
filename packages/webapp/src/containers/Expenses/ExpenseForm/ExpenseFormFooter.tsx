// @ts-nocheck
import React from 'react';
import classNames from 'classnames';

import { CLASSES } from '@/constants/classes';
import { Row, Col, Paper } from '@/components';
import { ExpenseFormFooterLeft } from './ExpenseFormFooterLeft';
import { ExpenseFormFooterRight } from './ExpenseFormFooterRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

export default function ExpenseFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
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
    </div>
  );
}
