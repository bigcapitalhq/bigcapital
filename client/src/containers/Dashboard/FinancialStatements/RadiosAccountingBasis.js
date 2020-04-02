import React from 'react';
import {handleStringChange} from 'utils';
import {useIntl} from 'react-intl';
import {
  RadioGroup,
  Radio,
} from "@blueprintjs/core";


export default function RadiosAccountingBasis(props) {
  const { onChange, ...rest } = props;
  const intl = useIntl();

  return (
    <RadioGroup
      inline={true}
      label={intl.formatMessage({'id': 'accounting_basis'})}
      name="basis"
      onChange={handleStringChange((value) => {
        onChange && onChange(value);
      })}
      {...rest}>
      <Radio label="Cash" value="cash" />
      <Radio label="Accural" value="accural" />
    </RadioGroup>
  );
}