import React, { useMemo, useState, useCallback } from 'react';
import {
  InputGroup,
  FormGroup,
  Intent,
  Position,
  ControlGroup,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import { Row, Col } from 'react-grid-system';
import moment from 'moment';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import { momentFormatter, tansformDateValue, saveInvoke } from 'utils';
import {
  ErrorMessage,
  Hint,
  FieldHint,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  CurrencySelectList,
} from 'components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withCurrencies from 'containers/Currencies/withCurrencies';
import withSettings from 'containers/Settings/withSettings';

import { compose } from 'utils';

function MakeJournalEntriesHeader({
  errors,
  touched,
  values,
  setFieldValue,
  getFieldProps,

  // #ownProps
  manualJournal,
  onJournalNumberChanged,

  // #withSettings
  baseCurrency,

  // #withCurrencies
  currenciesList,

  // #withDialog
  openDialog,
}) {
  const [selectedItems, setSelectedItems] = useState({});

  const handleDateChange = useCallback(
    (date) => {
      const formatted = moment(date).format('YYYY-MM-DD');
      setFieldValue('date', formatted);
    },
    [setFieldValue],
  );
  const handleJournalNumberChange = useCallback(() => {
    openDialog('journal-number-form', {});
  }, [openDialog]);

  // Handle journal number field blur event.
  const handleJournalNumberChanged = (event) => {
    saveInvoke(onJournalNumberChanged, event.currentTarget.value);
  };

  const onItemsSelect = useCallback(
    (filedName) => {
      return (filed) => {
        setSelectedItems({
          ...selectedItems,
          [filedName]: filed,
        });
        setFieldValue(filedName, filed.currency_code);
      };
    },
    [setFieldValue, selectedItems],
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
            <ControlGroup fill={true}>
              <InputGroup
                intent={
                  errors.journal_number &&
                  touched.journal_number &&
                  Intent.DANGER
                }
                fill={true}
                {...getFieldProps('journal_number')}
                onBlur={handleJournalNumberChanged}
              />
              <InputPrependButton
                buttonProps={{
                  onClick: handleJournalNumberChange,
                  icon: <Icon icon={'settings-18'} />,
                }}
                tooltip={true}
                tooltipProps={{
                  content: 'Setting your auto-generated journal number',
                  position: Position.BOTTOM_LEFT,
                }}
              />
            </ControlGroup>
          </FormGroup>
        </Col>

        <Col width={220}>
          <FormGroup
            label={<T id={'date'} />}
            labelInfo={<FieldRequiredHint />}
            intent={errors.date && touched.date && Intent.DANGER}
            helperText={<ErrorMessage name="date" {...{ errors, touched }} />}
            minimal={true}
            className={classNames(CLASSES.FILL)}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              onChange={handleDateChange}
              value={tansformDateValue(values.date)}
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
              CLASSES.FILL,
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
          <FormGroup
            label={<T id={'currency'} />}
            className={classNames(
              'form-group--select-list',
              'form-group--currency',
              CLASSES.FILL,
            )}
          >
            <CurrencySelectList
              currenciesList={currenciesList}
              selectedCurrencyCode={values.currency_code}
              onCurrencySelected={onItemsSelect('currency_code')}
              defaultSelectText={baseCurrency}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}

export default compose(
  withDialogActions,
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
  withCurrencies(({ currenciesList }) => ({
    currenciesList,
  })),
)(MakeJournalEntriesHeader);
