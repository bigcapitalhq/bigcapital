// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { FSelect, FFormGroup, FSwitch } from '@/components';
import {
  moneyFormat,
  negativeFormat,
  decimalPlaces,
} from '@/constants/numberFormatsOptions';

/**
 *  Number Formats Fields.
 */
export default function NumberFormatFields() {
  return (
    <div className={'number-format-dropdown__content'}>
      {/*------------ Negative formats -----------*/}
      <FFormGroup name={'negativeFormat'} label={intl.get('negative_format')}>
        <FSelect
          name={'negativeFormat'}
          items={negativeFormat}
          valueAccessor={'key'}
          textAccessor={'text'}
          popoverProps={{ minimal: true, captureDismiss: true }}
          filterable
        />
      </FFormGroup>

      {/*------------ Decimal places -----------*/}
      <FFormGroup name={'precision'} label={intl.get('decimal_places')}>
        <FSelect
          name={'precision'}
          items={decimalPlaces}
          filterable={false}
          valueAccessor={'key'}
          textAccessor={'text'}
          popoverProps={{ minimal: true, captureDismiss: true }}
        />
      </FFormGroup>

      {/*------------ Money formats -----------*/}
      <FFormGroup name={'formatMoney'} label={intl.get('money_format')}>
        <FSelect
          name={'formatMoney'}
          items={moneyFormat}
          filterable={false}
          valueAccessor={'key'}
          textAccessor={'text'}
          popoverProps={{ minimal: true, captureDismiss: true }}
        />
      </FFormGroup>

      <div className="toggles-fields">
        {/*------------ show zero -----------*/}
        <FFormGroup name={'showZero'} inline={true}>
          <FSwitch
            name={'showZero'}
            inline={true}
            small={true}
            label={intl.get('show_zero')}
          />
        </FFormGroup>

        {/*------------ show negative in red-----------*/}
        <FFormGroup name={'showInRed'} inline={true}>
          <FSwitch
            name={'showInRed'}
            inline={true}
            label={intl.get('show_negative_in_red')}
          />
        </FFormGroup>

        {/*------------ Divide on 1000 -----------*/}
        <FFormGroup name={'divideOn1000'} inline={true}>
          <FSwitch
            name={'divideOn1000'}
            inline={true}
            label={intl.get('divide_on_1000')}
          />
        </FFormGroup>
      </div>
    </div>
  );
}
