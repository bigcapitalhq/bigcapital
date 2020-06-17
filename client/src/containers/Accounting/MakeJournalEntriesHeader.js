import React, {useMemo, useCallback} from 'react';
import {
  InputGroup,
  FormGroup,
  Intent,
  Position,
} from '@blueprintjs/core';
import {DateInput} from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import {Row, Col} from 'react-grid-system';
import moment from 'moment';
import {momentFormatter} from 'utils';

import Icon from 'components/Icon';
import CurrenciesSelectList from 'components/CurrenciesSelectList';
import ErrorMessage from 'components/ErrorMessage';

export default function MakeJournalEntriesHeader({
  formik: { errors, touched, setFieldValue, getFieldProps }
}) {
 
  const handleDateChange = useCallback((date) => {
    const formatted = moment(date).format('YYYY-MM-DD');
    setFieldValue('date', formatted);
  }, [setFieldValue]);

  const infoIcon = useMemo(() =>
    (<Icon icon="info-circle" iconSize={12} />), []);

  return (
    <div class="make-journal-entries__header">
      <Row>
        <Col width={260}>
          <FormGroup
            label={<T id={'journal_number'}/>}
            labelInfo={infoIcon}
            className={'form-group--journal-number'}
            intent={(errors.journal_number && touched.journal_number) && Intent.DANGER}
            helperText={<ErrorMessage name="journal_number" {...{errors, touched}} />}
            fill={true}>

            <InputGroup
              intent={(errors.journal_number && touched.journal_number) && Intent.DANGER}
              fill={true}
              {...getFieldProps('journal_number')} />
          </FormGroup>
        </Col>

        <Col width={220}>
          <FormGroup
          label={<T id={'date'}/>}
            intent={(errors.date && touched.date) && Intent.DANGER}
            helperText={<ErrorMessage name="date" {...{errors, touched}} />}
            minimal={true}>

            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              defaultValue={new Date()}
              onChange={handleDateChange}
              popoverProps={{ position: Position.BOTTOM }} />
          </FormGroup>
        </Col>

        <Col width={400}>
          <FormGroup
            label={<T id={'description'}/>}
            className={'form-group--description'}
            intent={(errors.name && touched.name) && Intent.DANGER}
            helperText={<ErrorMessage name="description" {...{errors, touched}} />}
            fill={true}>

            <InputGroup
              intent={(errors.name && touched.name) && Intent.DANGER}
              fill={true}
              {...getFieldProps('description')} />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col width={260}>
          <FormGroup
            label={<T id={'reference'}/>}
            labelInfo={infoIcon}
            className={'form-group--reference'}
            intent={(errors.reference && touched.reference) && Intent.DANGER}
            helperText={<ErrorMessage name="reference" {...{errors, touched}} />}
            fill={true}>

            <InputGroup
              intent={(errors.reference && touched.reference) && Intent.DANGER}
              fill={true}
              {...getFieldProps('reference')} />
          </FormGroup>
        </Col>

        <Col width={220}>
          <CurrenciesSelectList />
        </Col>
      </Row>
    </div>
  );
}