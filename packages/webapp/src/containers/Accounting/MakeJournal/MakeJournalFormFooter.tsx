import classNames from 'classnames';
import React from 'react';
import { MakeJournalFormFooterLeft } from './MakeJournalFormFooterLeft';
import { MakeJournalFormFooterRight } from './MakeJournalFormFooterRight';
import { Row, Col, Paper } from '@/components';
import { CLASSES } from '@/constants/classes';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

export function MakeJournalFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <MakeJournalFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <MakeJournalFormFooterRight />
          </Col>
        </Row>
      </Paper>
    </div>
  );
}
