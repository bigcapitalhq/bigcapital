import React from 'react';
import styles from './ExpenseForm.module.scss';
import { ExpenseFormFooterLeft } from './ExpenseFormFooterLeft';
import { ExpenseFormFooterRight } from './ExpenseFormFooterRight';
import { Row, Col } from '@/components';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

export function ExpenseFormFooter() {
  return (
    <div className={styles.attachmentsFooter}>
      <div className={styles.attachmentsPaper}>
        <Row>
          <Col md={8}>
            <ExpenseFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <ExpenseFormFooterRight />
          </Col>
        </Row>
      </div>
    </div>
  );
}
