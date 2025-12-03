// @ts-nocheck
import React from 'react';
import { FastField, Form, ErrorMessage } from 'formik';
import { Button, Intent, FormGroup, Classes } from '@blueprintjs/core';
import classNames from 'classnames';
import { TimezonePicker } from '@blueprintjs/timezone';
import { getAllCountries } from '@bigcapital/utils';
import { x } from '@xstyled/emotion';
import {
  FFormGroup,
  FInputGroup,
  FSelect,
  FTimezoneSelect,
  FormattedMessage as T,
} from '@/components';

import { Col, Row } from '@/components';
import { inputIntent } from '@/utils';
import { useIsDarkMode } from '@/hooks/useDarkMode';

import { getFiscalYear } from '@/constants/fiscalYearOptions';
import { getLanguages } from '@/constants/languagesOptions';
import { getAllCurrenciesOptions } from '@/constants/currencies';

const countries = getAllCountries();

/**
 * Setup organization form.
 */
export default function SetupOrganizationForm({ isSubmitting, values }) {
  const FiscalYear = getFiscalYear();
  const Languages = getLanguages();
  const currencies = getAllCurrenciesOptions();
  const isDarkMode = useIsDarkMode();

  return (
    <Form>
      <x.h3
        color={isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#868f9f'}
        mb="2rem"
        fontWeight={600}
      >
        <T id={'organization_details'} />
      </x.h3>
      {/* ---------- Organization name ----------  */}
      <FFormGroup
        name={'name'}
        label={<T id={'legal_organization_name'} />}
        fastField
      >
        <FInputGroup name={'name'} large fastField />
      </FFormGroup>

      {/* ---------- Location ---------- */}
      <FFormGroup
        name={'location'}
        label={<T id={'business_location'} />}
        fastField={true}
      >
        <FSelect
          name={'location'}
          items={countries}
          valueAccessor={'countryCode'}
          textAccessor={'name'}
          placeholder={<T id={'select_business_location'} />}
          popoverProps={{ minimal: true }}
          buttonProps={{ large: true }}
          fastField
        />
      </FFormGroup>

      <Row>
        <Col xs={6}>
          {/* ----------  Base currency ----------  */}
          <FFormGroup
            name={'baseCurrency'}
            label={<T id={'base_currency'} />}
            fastField={true}
          >
            <FSelect
              name={'baseCurrency'}
              items={currencies}
              popoverProps={{ minimal: true }}
              valueAccessor={'key'}
              textAccessor={'name'}
              placeholder={<T id={'select_base_currency'} />}
              buttonProps={{ large: true }}
              fastField
            />
          </FFormGroup>
        </Col>

        {/* ---------- Language ---------- */}
        <Col xs={6}>
          <FFormGroup name={'language'} label={<T id={'language'} />} fastField>
            <FSelect
              name={'language'}
              items={Languages}
              valueAccessor={'value'}
              textAccessor={'name'}
              placeholder={<T id={'select_language'} />}
              popoverProps={{ minimal: true }}
              buttonProps={{ large: true }}
              fastField
            />
          </FFormGroup>
        </Col>
      </Row>

      {/* --------- Fiscal Year ----------- */}
      <FFormGroup
        name={'fiscalYear'}
        label={<T id={'fiscal_year'} />}
        fastField
      >
        <FSelect
          name={'fiscalYear'}
          items={FiscalYear}
          valueAccessor={'key'}
          textAccessor={'name'}
          placeholder={<T id={'select_fiscal_year'} />}
          popoverProps={{ minimal: true }}
          buttonProps={{ large: true }}
          fastField
        />
      </FFormGroup>

      {/* ----------  Time zone ----------  */}
      <FFormGroup name={'timezone'} label={<T id={'time_zone'} />}>
        <FTimezoneSelect
          name={'timezone'}
          valueDisplayFormat="composite"
          showLocalTimezone={true}
          placeholder={<T id={'select_time_zone'} />}
          popoverProps={{ minimal: true }}
          buttonProps={{
            alignText: 'left',
            fill: true,
            large: true,
          }}
        />
      </FFormGroup>

      <x.p
        fontSize={14}
        lineHeight="2.7rem"
        mb={6}
        borderBottom={`1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f5f5f5'}`}
        className={Classes.TEXT_MUTED}
      >
        <T id={'setup.organization.note_you_can_change_your_preferences'} />
      </x.p>

      <x.div>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          fill
          large
          type="submit"
        >
          <T id={'save_continue'} />
        </Button>
      </x.div>
    </Form>
  );
}
