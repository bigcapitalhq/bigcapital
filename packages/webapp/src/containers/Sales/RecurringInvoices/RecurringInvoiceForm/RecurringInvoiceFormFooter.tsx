import { x } from '@xstyled/emotion';
import React from 'react';
import { RecurringInvoiceFormFooterLeft } from './RecurringInvoiceFormFooterLeft';
import { RecurringInvoiceFormFooterRight } from './RecurringInvoiceFormFooterRight';
import { Row, Col, Paper } from '@/components';

/**
 * Recurring invoice form footer.
 */
export function RecurringInvoiceFormFooter() {
  return (
    <x.div mt={'20px'} px={'32px'} pb={'20px'} flex={1}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <RecurringInvoiceFormFooterLeft />
          </Col>

          <Col md={4}>
            <RecurringInvoiceFormFooterRight />
          </Col>
        </Row>
      </Paper>
    </x.div>
  );
}
