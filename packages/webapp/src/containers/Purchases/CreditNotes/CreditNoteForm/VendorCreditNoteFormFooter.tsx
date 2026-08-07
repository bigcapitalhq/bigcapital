import { x } from '@xstyled/emotion';
import { VendorCreditNoteFormFooterLeft } from './VendorCreditNoteFormFooterLeft';
import { VendorCreditNoteFormFooterRight } from './VendorCreditNoteFormFooterRight';
import { Row, Col, Paper } from '@/components';
import { UploadAttachmentButton } from '@/containers/Attachments/UploadAttachmentButton';

export function VendorCreditNoteFormFooter() {
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
