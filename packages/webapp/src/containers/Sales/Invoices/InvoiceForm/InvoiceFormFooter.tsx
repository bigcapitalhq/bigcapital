// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/constants/classes';
import { Paper, Row, Col } from '@/components';
import { InvoiceFormFooterLeft } from './InvoiceFormFooterLeft';
import { InvoiceFormFooterRight } from './InvoiceFormFooterRight';
import { UploadAttachmentButton } from '../../../Attachments/UploadAttachmentButton';

export default function InvoiceFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <InvoiceFooterPaper>
        <Row>
          <Col md={8}>
            <InvoiceFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <InvoiceFormFooterRight />
          </Col>
        </Row>
      </InvoiceFooterPaper>
    </div>
  );
}

const InvoiceFooterPaper = styled(Paper)`
  padding: 20px;
`;
