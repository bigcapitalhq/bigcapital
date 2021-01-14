import React from 'react';
import { Form, FastField, ErrorMessage, useFormikContext } from 'formik';
import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  Checkbox,
} from '@blueprintjs/core';
import { CLASSES } from 'common/classes';
import { Row, Col, ListSelect } from 'components';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { inputIntent } from 'utils';
import {
  moneyFormat,
  negativeFormat,
  decimalPlaces,
} from 'common/numberFormatsOptions';
import classNames from 'classnames';

/**
 *  Number Formats Fields.
 */
export default function NumberFormatFields({
  // #ownProps
  onCancelClick,
}) {
  const { isSubmitting } = useFormikContext();
  return (
    <Form>
      <div className={'number-format__content'}>
        {/*------------ Money formats -----------*/}
        <FastField name={'format_money'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'money_format'} />}
              helperText={<ErrorMessage name="format_money" />}
              intent={inputIntent({ error, touched })}
              className={classNames(CLASSES.FILL)}
            >
              <ListSelect
                items={moneyFormat}
                onItemSelect={(format) => {
                  form.setFieldValue('format_money', format.name);
                }}
                filterable={false}
                selectedItem={value}
                selectedItemProp={'id'}
                textProp={'text'}
                popoverProps={{ minimal: true, captureDismiss: true }}
              />
            </FormGroup>
          )}
        </FastField>
        {/*------------ Negative formats -----------*/}
        <FastField name={'negative_format'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'negative_format'} />}
              helperText={<ErrorMessage name="negative_format" />}
              intent={inputIntent({ error, touched })}
              className={classNames(CLASSES.FILL)}
            >
              <ListSelect
                items={negativeFormat}
                onItemSelect={(format) => {
                  form.setFieldValue('negative_format', format.name);
                }}
                filterable={false}
                selectedItem={value}
                selectedItemProp={'id'}
                textProp={'text'}
                popoverProps={{ minimal: true, captureDismiss: true }}
              />
            </FormGroup>
          )}
        </FastField>

        {/*------------ Decimal places -----------*/}
        <FastField name={'precision'}>
          {({ form, field: { value }, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'decimal_places'} />}
              helperText={<ErrorMessage name="format_money" />}
              intent={inputIntent({ error, touched })}
              className={classNames(CLASSES.FILL)}
            >
              <ListSelect
                items={decimalPlaces}
                onItemSelect={(format) => {
                  form.setFieldValue('precision', format.key);
                }}
                filterable={false}
                selectedItem={value}
                selectedItemProp={'id'}
                labelProp={'label'}
                textProp={'text'}
                popoverProps={{ minimal: true, captureDismiss: true }}
              />
            </FormGroup>
          )}
        </FastField>

        {/*------------ show zero -----------*/}
        <FastField name={'show_zero'} type={'checkbox'}>
          {({ field }) => (
            <FormGroup inline={true}>
              <Checkbox
                inline={true}
                label={<T id={'show_zero'} />}
                name={'show_zero'}
                {...field}
              />
            </FormGroup>
          )}
        </FastField>
        {/*------------ Divide on 1000 -----------*/}
        <FastField name={'divide_on_1000'} type={'checkbox'}>
          {({ field }) => (
            <FormGroup inline={true}>
              <Checkbox
                inline={true}
                label={<T id={'divide_on_1000'} />}
                name={'divide_on_1000'}
                {...field}
              />
            </FormGroup>
          )}
        </FastField>
      </div>
      <div
        className={classNames('number-format__footer', Classes.POPOVER_DISMISS)}
      >
        <Button
          className={'mr1'}
          onClick={onCancelClick}
          small={true}
          style={{ minWidth: '75px' }}
        >
          <T id={'cancel'} />
        </Button>

        <Button
          intent={Intent.PRIMARY}
          disabled={isSubmitting}
          small={true}
          style={{ minWidth: '75px' }}
          type="submit"
        >
          <T id={'run'} />
        </Button>
      </div>
    </Form>
  );
}
