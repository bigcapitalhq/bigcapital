// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Row, Col, Paper } from '@/components';
import { CreditNoteFormFooterLeft } from './CreditNoteFormFooterLeft';
import { CreditNoteFormFooterRight } from './CreditNoteFormFooterRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

/**
 * Credit note form footer.
 */
export default function CreditNoteFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <CreditNoteFooterPaper>
        <Row>
          <Col md={8}>
            <CreditNoteFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <CreditNoteFormFooterRight />
          </Col>
        </Row>
      </CreditNoteFooterPaper>
    </div>
  );
}
const CreditNoteFooterPaper = styled(Paper)`
  padding: 20px;
`;
