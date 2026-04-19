// @ts-nocheck
import React from 'react';
import { Form, useFormikContext } from 'formik';
import {
  FormGroup,
  InputGroup,
  HTMLSelect,
  Button,
  Intent,
} from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import { useAccounts } from '@/hooks/query';

/**
 * Form field component.
 */
function Field({ name, label, children, helperText }) {
  const { errors, touched } = useFormikContext();
  const hasError = touched[name] && errors[name];

  return (
    <FormGroup
      label={label}
      helperText={hasError ? errors[name] : helperText}
      intent={hasError ? Intent.DANGER : Intent.NONE}
    >
      {children}
    </FormGroup>
  );
}

/**
 * Asset form fields.
 */
export function AssetFormFields({ onCancel, isSubmitting }) {
  const { values, handleChange, handleBlur, setFieldValue } = useFormikContext();
  const { data: accountsData } = useAccounts({}, { keepPreviousData: true });

  const fixedAssetAccounts = React.useMemo(() => {
    return accountsData?.accounts?.filter(
      (account) => account.accountType === 'fixed-asset'
    ) || [];
  }, [accountsData]);

  const expenseAccounts = React.useMemo(() => {
    return accountsData?.accounts?.filter(
      (account) => account.accountType === 'expense'
    ) || [];
  }, [accountsData]);

  return (
    <Form>
      <div className="page-form">
        <div className="page-form__body">
          <h3><T id="asset_details" /></h3>

          <Field name="name" label={<T id="asset_name" />}>
            <InputGroup
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>

          <Field name="code" label={<T id="asset_code" />}>
            <InputGroup
              name="code"
              value={values.code}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>

          <Field name="description" label={<T id="description" />}>
            <InputGroup
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>

          <Field name="assetAccountId" label={<T id="asset_account" />}>
            <HTMLSelect
              name="assetAccountId"
              value={values.assetAccountId}
              onChange={handleChange}
              options={[
                { label: 'Select Account', value: '' },
                ...fixedAssetAccounts.map((acc) => ({
                  label: acc.name,
                  value: acc.id,
                })),
              ]}
            />
          </Field>

          <h3><T id="purchase_details" /></h3>

          <Field name="purchasePrice" label={<T id="purchase_price" />}>
            <InputGroup
              name="purchasePrice"
              type="number"
              value={values.purchasePrice}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>

          <Field name="purchaseDate" label={<T id="purchase_date" />}>
            <InputGroup
              name="purchaseDate"
              type="date"
              value={values.purchaseDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>

          <h3><T id="depreciation_settings" /></h3>

          <Field name="depreciationMethod" label={<T id="depreciation_method" />}>
            <HTMLSelect
              name="depreciationMethod"
              value={values.depreciationMethod}
              onChange={handleChange}
              options={[
                { label: 'Straight Line', value: 'straight_line' },
                { label: 'Declining Balance', value: 'declining_balance' },
              ]}
            />
          </Field>

          {values.depreciationMethod === 'straight_line' && (
            <Field name="usefulLifeYears" label={<T id="useful_life_years" />}>
              <InputGroup
                name="usefulLifeYears"
                type="number"
                value={values.usefulLifeYears}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>
          )}

          {values.depreciationMethod === 'declining_balance' && (
            <Field name="depreciationRate" label={<T id="depreciation_rate_percent" />}>
              <InputGroup
                name="depreciationRate"
                type="number"
                value={values.depreciationRate}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>
          )}

          <Field name="residualValue" label={<T id="residual_value" />}>
            <InputGroup
              name="residualValue"
              type="number"
              value={values.residualValue}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>

          <Field name="depreciationStartDate" label={<T id="depreciation_start_date" />}>
            <InputGroup
              name="depreciationStartDate"
              type="date"
              value={values.depreciationStartDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>

          <Field name="depreciationExpenseAccountId" label={<T id="depreciation_expense_account" />}>
            <HTMLSelect
              name="depreciationExpenseAccountId"
              value={values.depreciationExpenseAccountId}
              onChange={handleChange}
              options={[
                { label: 'Select Account', value: '' },
                ...expenseAccounts.map((acc) => ({
                  label: acc.name,
                  value: acc.id,
                })),
              ]}
            />
          </Field>

          <Field name="accumulatedDepreciationAccountId" label={<T id="accumulated_depreciation_account" />}>
            <HTMLSelect
              name="accumulatedDepreciationAccountId"
              value={values.accumulatedDepreciationAccountId}
              onChange={handleChange}
              options={[
                { label: 'Select Account', value: '' },
                ...fixedAssetAccounts.map((acc) => ({
                  label: acc.name,
                  value: acc.id,
                })),
              ]}
            />
          </Field>
        </div>

        <div className="page-form__floating-actions">
          <Button onClick={onCancel}>
            <T id="cancel" />
          </Button>
          <Button
            type="submit"
            intent={Intent.PRIMARY}
            loading={isSubmitting}
          >
            <T id="save" />
          </Button>
        </div>
      </div>
    </Form>
  );
}
