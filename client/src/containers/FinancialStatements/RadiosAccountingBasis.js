import React from 'react';
import {handleStringChange} from 'utils';
import {useIntl} from 'react-intl';
import {
  RadioGroup,
  Radio,
} from "@blueprintjs/core";


export default function RadiosAccountingBasis(props) {
  const { onChange, ...rest } = props;
  const {formatMessage} = useIntl();

  return (
    <RadioGroup
      inline={true}
      label={formatMessage({'id': 'accounting_basis'})}
      name="basis"
      onChange={handleStringChange((value) => {
        onChange && onChange(value);
      })}
      className={'radio-group---accounting-basis'}
      {...rest}>
      <Radio label={formatMessage({id:'cash'})} value="cash" />
      <Radio label={formatMessage({id:'accrual'})} value="accural" />
    </RadioGroup>
  );
}