import React from 'react';

import footerLinks from 'config/footerLinks';
import { For } from 'components';

function FooterLinkItem({ title, link }) {
  return (
    <div class="">
      <a href={link} target="_blank">
        {title}
      </a>
    </div>
  );
}

export default function DashboardFooter({}) {
  return (
    <div class="dashboard__footer">
      <div class="footer-links">
        <For render={FooterLinkItem} of={footerLinks} />
      </div>
    </div>
  );
}
