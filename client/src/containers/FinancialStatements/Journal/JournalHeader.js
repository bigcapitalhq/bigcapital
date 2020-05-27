import React, { useCallback } from 'react';
import { Row, Col } from 'react-grid-system';
import {
  Button,
} from '@blueprintjs/core';
import moment from 'moment';
import { useFormik } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import * as Yup from 'yup';

import FinancialStatementDateRange from 'containers/FinancialStatements/FinancialStatementDateRange';
import FinancialStatementHeader from 'containers/FinancialStatements/FinancialStatementHeader';

import withJournal from './withJournal';
import { compose } from 'utils';

/**
 * Journal sheet header. 
 */
function JournalHeader({
  pageFilter,
  onSubmitFilter,

  // #withJournal
  journalSheetFilter,
}) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...pageFilter,
      from_date: moment(pageFilter.from_date).toDate(),
      to_date: moment(pageFilter.to_date).toDate()
    },
    validationSchema: Yup.object().shape({
      from_date: Yup.date().required(),
      to_date: Yup.date().min(Yup.ref('from_date')).required(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      onSubmitFilter(values);
      setSubmitting(false);
    },
  });

  const handleSubmitClick = useCallback(() => {
    formik.submitForm();
  }, [formik]);

  return (
    <FinancialStatementHeader show={journalSheetFilter}>
      <FinancialStatementDateRange formik={formik} />

      <Row>
        <Col sm={3}>
          <Button
            type="submit"
            onClick={handleSubmitClick}
            className={'button--submit-filter'}>
            <T id={'run_report'} />
          </Button>
        </Col>
      </Row>

    </FinancialStatementHeader>
  );
}

export default compose(
  withJournal(({ journalSheetFilter }) => ({ journalSheetFilter })),
)(JournalHeader);