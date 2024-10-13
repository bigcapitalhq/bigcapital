// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Paper, Row, Col } from '@/components';
import { BillFormFooterLeft } from './BillFormFooterLeft';
import { BillFormFooterRight } from './BillFormFooterRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

// Bill form floating actions.
export default function BillFormFooter() {
  return (
    <div class={classNames(CLASSES.PAGE_FORM_FOOTER)}>
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
    </div>
  );
}
