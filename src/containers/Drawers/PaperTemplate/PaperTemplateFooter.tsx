import React from 'react';
import { If } from '@/components';
import intl from 'react-intl-universal';

export default function PaperTemplateFooter({
  footerData: { terms_conditions },
}) {
  return (
    <div className="template__terms">
      <If condition={terms_conditions}>
        <div className="template__terms__title">
          <h4>{intl.get('conditions_and_terms')}</h4>
        </div>

        <ul>
          {[terms_conditions].map((terms) => (
            <li>{terms}</li>
          ))}
        </ul>
      </If>
    </div>
  );
}
