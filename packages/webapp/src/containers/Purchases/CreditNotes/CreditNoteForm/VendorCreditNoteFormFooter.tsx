// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { x } from '@xstyled/emotion';

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
    <x.div mt={'20px'} px={'32px'} pb={'20px'} flex={1}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <VendorCreditNoteFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <VendorCreditNoteFormFooterRight />
          </Col>
        </Row>
      </Paper>
    </x.div>
  );
}
