import { x } from '@xstyled/emotion';
import React from 'react';
import { EstimateFormFooterLeft } from './EstimateFormFooterLeft';
import { EstimateFormFooterRight } from './EstimateFormFooterRight';
import { Row, Col, Paper } from '@/components';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

/**
 * Estimate form footer.
 */
export function EstiamteFormFooter() {
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
