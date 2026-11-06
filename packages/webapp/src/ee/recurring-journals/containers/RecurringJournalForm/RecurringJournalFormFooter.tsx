import classNames from 'classnames';
import React from 'react';
import { Row, Col, Paper } from '@/components';
import { CLASSES } from '@/constants/classes';
import { MakeJournalFormFooterLeft } from '@/containers/Accounting/MakeJournal/MakeJournalFormFooterLeft';
import { MakeJournalFormFooterRight } from '@/containers/Accounting/MakeJournal/MakeJournalFormFooterRight';

export function RecurringJournalFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <MakeJournalFormFooterLeft />
          </Col>
          <Col md={4}>
            <MakeJournalFormFooterRight />
          </Col>
        </Row>
      </Paper>
    </div>
  );
}
