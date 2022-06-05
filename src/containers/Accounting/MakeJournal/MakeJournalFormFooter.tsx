import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { CLASSES } from '@/common/classes';
import { Row, Col, Paper } from '@/components';
import { MakeJournalFormFooterLeft } from './MakeJournalFormFooterLeft';
import { MakeJournalFormFooterRight } from './MakeJournalFormFooterRight';

export default function MakeJournalFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <MakeJournalFooterPaper>
        <Row>
          <Col md={8}>
            <MakeJournalFormFooterLeft />
          </Col>

          <Col md={4}>
            <MakeJournalFormFooterRight />
          </Col>
        </Row>
      </MakeJournalFooterPaper>
    </div>
  );
}
const MakeJournalFooterPaper = styled(Paper)`
  padding: 20px;
`;
