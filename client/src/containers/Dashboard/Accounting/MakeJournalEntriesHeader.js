import React from 'react';
import * as Yup from 'yup';
import {
  InputGroup,
  FormGroup,
  Intent,
  Position,
} from '@blueprintjs/core';
import {DatePicker, DateInput} from '@blueprintjs/datetime';
import {Formik, useFormik} from "formik";
import {useIntl} from 'react-intl';
import {Row, Col} from 'react-grid-system';
import moment from 'moment';
import {momentFormatter} from 'utils';

export default function MakeJournalEntriesHeader({
  formik
}) {
  const intl = useIntl();
 
  const handleDateChange = (date) => {
    const formatted = moment(date).format('YYYY-MM-DD');
    formik.setFieldValue('date', formatted);
  };
  return (
    <div class="make-journal-entries__header">
      <Row>
        <Col sm={4}>
          <FormGroup
            label={intl.formatMessage({'id': 'reference'})}
            className={'form-group--reference'}
            intent={formik.errors.name && Intent.DANGER}
            helperText={formik.errors.name && formik.errors.label}
            fill={true}>

            <InputGroup
              intent={formik.errors.name && Intent.DANGER}
              fill={true}
              {...formik.getFieldProps('reference')} />
          </FormGroup>
        </Col>

        <Col sm={3}>
          <FormGroup
            label={intl.formatMessage({'id': 'date'})}
            intent={formik.errors.date && Intent.DANGER}
            helperText={formik.errors.date && formik.errors.date}
            minimal={true}>

            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              defaultValue={new Date()}
              onChange={handleDateChange}
              popoverProps={{ position: Position.BOTTOM }} />
          </FormGroup>
        </Col>

        <Col sm={4}>
          <FormGroup
            label={intl.formatMessage({'id': 'description'})}
            className={'form-group--description'}
            intent={formik.errors.name && Intent.DANGER}
            helperText={formik.errors.name && formik.errors.label}
            fill={true}>

            <InputGroup
              intent={formik.errors.name && Intent.DANGER}
              fill={true}
              {...formik.getFieldProps('description')} />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}