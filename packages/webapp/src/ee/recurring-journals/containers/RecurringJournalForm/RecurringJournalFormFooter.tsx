import classNames from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  useRecurringJournalSubtotalFormatted,
  useRecurringJournalTotalFormatted,
} from './utils';
import {
  Row,
  Col,
  Paper,
  T,
  FFormGroup,
  FSwitch,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { MakeJournalFormFooterLeft } from '@/containers/Accounting/MakeJournal/MakeJournalFormFooterLeft';

export function RecurringJournalFormFooter() {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FOOTER)}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <MakeJournalFormFooterLeft>
              <RecurringJournalAutoPublishField />
            </MakeJournalFormFooterLeft>
          </Col>
          <Col md={4}>
            <RecurringJournalFormFooterRight />
          </Col>
        </Row>
      </Paper>
    </div>
  );
}

function RecurringJournalAutoPublishField() {
  return (
    <AutoPublishFormGroup
      name={'autoPublish'}
      helperText={intl.get('recurring_journal.field.auto_publish_hint')}
    >
      <FSwitch
        name={'autoPublish'}
        labelElement={intl.get('recurring_journal.field.auto_publish')}
        large={true}
      />
    </AutoPublishFormGroup>
  );
}

function RecurringJournalFormFooterRight() {
  const formattedSubtotal = useRecurringJournalSubtotalFormatted();
  const formattedTotal = useRecurringJournalTotalFormatted();

  return (
    <RecurringJournalTotalLines>
      <TotalLine
        title={<T id={'make_journal.label.subtotal'} />}
        value={formattedSubtotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'make_journal.label.total'} />}
        value={formattedTotal}
        textStyle={TotalLineTextStyle.Bold}
      />
    </RecurringJournalTotalLines>
  );
}

const AutoPublishFormGroup = styled(FFormGroup)`
  &.bp4-form-group {
    margin-top: 12px;
    margin-bottom: 0;

    .bp4-form-content {
      margin-left: 10px;
    }
  }
`;

const RecurringJournalTotalLines = styled(TotalLines)`
  --x-color-text: #555;
  --x-color-text: var(--color-light-gray4);

  width: 100%;
  color: var(--x-color-text);
`;
