import React, { useMemo, useCallback } from 'react';
import {
  InputGroup,
  FormGroup,
  Intent,
  Position,
  Classes,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import { Row, Col } from 'react-grid-system';
import moment from 'moment';
import classNames from 'classnames';
import { momentFormatter } from 'utils';
import {
  CurrenciesSelectList,
  ErrorMessage,
  Hint,
  FieldHint,
  FieldRequiredHint,
} from 'components';

export default function MakeJournalEntriesHeader({
  formik: { errors, touched, values, setFieldValue, getFieldProps },
}) {
  const handleDateChange = useCallback(
    (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue('date', formatted);
    },
    [setFieldValue],
  );

  return (
    <div class="make-journal-entries__header">
      <Row>
        <Col width={260}>
          <FormGroup
            label={<T id={'journal_number'} />}
            labelInfo={
              <>
                <FieldRequiredHint />
                <FieldHint />
              </>
            }
            className={'form-group--journal-number'}
            intent={
              errors.journal_number && touched.journal_number && Intent.DANGER
            }
            helperText={
              <ErrorMessage name="journal_number" {...{ errors, touched }} />
            }
            fill={true}
          >
            <InputGroup
              intent={
                errors.journal_number && touched.journal_number && Intent.DANGER
              }
              fill={true}
              {...getFieldProps('journal_number')}
            />
          </FormGroup>
        </Col>

        <Col width={220}>
          <FormGroup
            label={<T id={'date'} />}
            labelInfo={<FieldRequiredHint />}
            intent={errors.date && touched.date && Intent.DANGER}
            helperText={<ErrorMessage name="date" {...{ errors, touched }} />}
            minimal={true}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              defaultValue={new Date()}
              onChange={handleDateChange}
              popoverProps={{
                position: Position.BOTTOM,
                minimal: true,
              }}
            />
          </FormGroup>
        </Col>

        <Col width={400}>
          <FormGroup
            label={<T id={'description'} />}
            className={'form-group--description'}
            intent={errors.name && touched.name && Intent.DANGER}
            helperText={
              <ErrorMessage name="description" {...{ errors, touched }} />
            }
            fill={true}
          >
            <InputGroup
              intent={errors.name && touched.name && Intent.DANGER}
              fill={true}
              {...getFieldProps('description')}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col width={260}>
          <FormGroup
            label={<T id={'reference'} />}
            labelInfo={
              <Hint
                content={<T id={'journal_reference_hint'} />}
                position={Position.RIGHT}
              />
            }
            className={'form-group--reference'}
            intent={errors.reference && touched.reference && Intent.DANGER}
            helperText={
              <ErrorMessage name="reference" {...{ errors, touched }} />
            }
            fill={true}
          >
            <InputGroup
              intent={errors.reference && touched.reference && Intent.DANGER}
              fill={true}
              {...getFieldProps('reference')}
            />
          </FormGroup>
        </Col>

        <Col width={220}>
          <FormGroup
            label={<T id={'journal_type'} />}
            className={classNames(
              'form-group--account-type',
              'form-group--select-list',
              Classes.FILL,
            )}
          >
            <InputGroup
              intent={
                errors.journal_type && touched.journal_type && Intent.DANGER
              }
              fill={true}
              {...getFieldProps('journal_type')}
            />
          </FormGroup>
        </Col>

        <Col width={230}>
          <CurrenciesSelectList className={Classes.FILL} />
        </Col>
      </Row>
    </div>
  );
}
