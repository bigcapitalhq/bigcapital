import React, {useMemo, useCallback} from 'react';
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
import Icon from 'components/Icon';
import CurrenciesSelectList from 'components/CurrenciesSelectList';


export default function MakeJournalEntriesHeader({
  formik
}) {
  const intl = useIntl();
 
  const handleDateChange = (date) => {
    const formatted = moment(date).format('YYYY-MM-DD');
    formik.setFieldValue('date', formatted);
  };

  const infoIcon = useMemo(() => (<Icon icon="info-circle" iconSize={12} />), []);

  return (
    <div class="make-journal-entries__header">
      <Row>
        <Col sm={3}>
          <FormGroup
            label={'Journal number'}
            labelInfo={infoIcon}
            className={'form-group--journal-number'}
            intent={formik.errors.journal_number && Intent.DANGER}
            helperText={formik.errors.journal_number && formik.errors.journal_number}
            fill={true}>

            <InputGroup
              intent={formik.errors.journal_number && Intent.DANGER}
              fill={true}
              {...formik.getFieldProps('journal_number')} />
          </FormGroup>
        </Col>

        <Col sm={2}>
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

      <Row>
        <Col sm={3}>
          <FormGroup
            label={'Reference'}
            labelInfo={infoIcon}
            className={'form-group--reference'}
            intent={formik.errors.reference && Intent.DANGER}
            helperText={formik.errors.reference && formik.errors.reference}
            fill={true}>

            <InputGroup
              intent={formik.errors.reference && Intent.DANGER}
              fill={true}
              {...formik.getFieldProps('reference')} />
          </FormGroup>
        </Col>

        <Col sm={4}>
          <CurrenciesSelectList />
        </Col>
      </Row>
    </div>
  );
}