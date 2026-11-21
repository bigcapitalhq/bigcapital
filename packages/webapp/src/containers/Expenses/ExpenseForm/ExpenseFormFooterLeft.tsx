import React from 'react';
import intl from 'react-intl-universal';
import styles from './ExpenseForm.module.scss';
import { FFormGroup, FEditableText, FormattedMessage as T } from '@/components';

export function ExpenseFormFooterLeft() {
  return (
    <React.Fragment>
      {/* --------- Description --------- */}
      <FFormGroup
        className={styles.descriptionGroup}
        label={intl.get('description')}
        name={'description'}
      >
        <FEditableText
          name={'description'}
          placeholder={(<T id={'expenses.decscrption.placeholder'} />) as any}
          multiline
          fastField
        />
      </FFormGroup>
    </React.Fragment>
  );
}
