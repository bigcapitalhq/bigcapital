// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Row, Col, Paper } from '@/components';
import { VendorCreditNoteFormFooterLeft } from './VendorCreditNoteFormFooterLeft';
import { VendorCreditNoteFormFooterRight } from './VendorCreditNoteFormFooterRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

/**
 * Vendor Credit note form footer.
 */
export default function VendorCreditNoteFormFooter() {
  return (
    <div class={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <VendorCreditNoteFooterPaper>
        <Row>
          <Col md={8}>
            <VendorCreditNoteFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <VendorCreditNoteFormFooterRight />
          </Col>
        </Row>
      </VendorCreditNoteFooterPaper>
    </div>
  );
}

const VendorCreditNoteFooterPaper = styled(Paper)`
  padding: 20px;
`;
