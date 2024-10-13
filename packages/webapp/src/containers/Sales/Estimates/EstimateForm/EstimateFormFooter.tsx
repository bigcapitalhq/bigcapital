// @ts-nocheck
import React from 'react';
import { x } from '@xstyled/emotion';

import { Row, Col, Paper } from '@/components';
import { EstimateFormFooterLeft } from './EstimateFormFooterLeft';
import { EstimateFormFooterRight } from './EstimateFormFooterRight';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

/**
 * Estimate form footer.
 */
export default function EstiamteFormFooter() {
  return (
    <x.div mt={'20px'} px={'32px'} pb={'20px'} flex={1}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <EstimateFormFooterLeft />
            <UploadAttachmentButton />
          </Col>

          <Col md={4}>
            <EstimateFormFooterRight />
          </Col>
        </Row>
      </Paper>
    </x.div>
  );
}
