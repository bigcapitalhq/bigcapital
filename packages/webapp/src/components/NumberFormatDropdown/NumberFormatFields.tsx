// @ts-nocheck
import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { FormGroup, Checkbox, Switch } from '@blueprintjs/core';
import { CLASSES } from '@/constants/classes';
import { ListSelect } from '@/components';
import { FormattedMessage as T } from '@/components';
import { inputIntent } from '@/utils';
import {
  moneyFormat,
  negativeFormat,
  decimalPlaces,
} from '@/constants/numberFormatsOptions';
import classNames from 'classnames';

/**
 *  Number Formats Fields.
 */
export default function NumberFormatFields({}) {
  return (
    <div className={'number-format-dropdown__content'}>
      {/*------------ Negative formats -----------*/}
      <FastField name={'negativeFormat'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'negative_format'} />}
            helperText={<ErrorMessage name="negativeFormat" />}
            intent={inputIntent({ error, touched })}
            className={classNames(CLASSES.FILL)}
          >
            <ListSelect
              items={negativeFormat}
              onItemSelect={(format) => {
                form.setFieldValue('negativeFormat', format.key);
              }}
              filterable={false}
              selectedItem={value}
              selectedItemProp={'key'}
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
              selectedItemProp={'key'}
              textProp={'text'}
              popoverProps={{ minimal: true, captureDismiss: true }}
            />
          </FormGroup>
        )}
      </FastField>

      {/*------------ Money formats -----------*/}
      <FastField name={'formatMoney'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'money_format'} />}
            helperText={<ErrorMessage name="formatMoney" />}
            intent={inputIntent({ error, touched })}
            className={classNames('form-group--money-format', CLASSES.FILL)}
          >
            <ListSelect
              items={moneyFormat}
              onItemSelect={(format) => {
                form.setFieldValue('formatMoney', format.key);
              }}
              filterable={false}
              selectedItem={value}
              selectedItemProp={'key'}
              textProp={'text'}
              popoverProps={{ minimal: true, captureDismiss: true }}
            />
          </FormGroup>
        )}
      </FastField>

      <div className="toggles-fields">
        {/*------------ show zero -----------*/}
        <FastField name={'showZero'} type={'checkbox'}>
          {({ field }) => (
            <FormGroup inline={true}>
              <Switch
                inline={true}
                small={true}
                label={<T id={'show_zero'} />}
                name={'showZero'}
                {...field}
              />
            </FormGroup>
          )}
        </FastField>

        {/*------------ show negative in red-----------*/}
        <FastField name={'showInRed'} type={'checkbox'}>
          {({ field }) => (
            <FormGroup inline={true}>
              <Switch
                inline={true}
                label={<T id={'show_negative_in_red'} />}
                name={'showInRed'}
                {...field}
              />
            </FormGroup>
          )}
        </FastField>

        {/*------------ Divide on 1000 -----------*/}
        <FastField name={'divideOn1000'} type={'checkbox'}>
          {({ field }) => (
            <FormGroup inline={true}>
              <Switch
                inline={true}
                label={<T id={'divide_on_1000'} />}
                name={'divideOn1000'}
                {...field}
              />
            </FormGroup>
          )}
        </FastField>
      </div>
    </div>
  );
}
