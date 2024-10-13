// @ts-nocheck
import React from 'react';
import classNames from 'classnames';

import { CLASSES } from '@/constants/classes';
import { Row, Col, Paper } from '@/components';
import { MakeJournalFormFooterLeft } from './MakeJournalFormFooterLeft';
import { MakeJournalFormFooterRight } from './MakeJournalFormFooterRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

export default function MakeJournalFormFooter() {
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
