// @ts-nocheck
import React from 'react';
import { getFooterLinks } from '@/constants/footerLinks';
import { For } from '@/components';

function FooterLinkItem({ title, link }) {
  return (
    <div class="">
      <a href={link} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
    </div>
  );
}

export default function DashboardFooter() {
  const footerLinks = getFooterLinks();

  return (
    <div class="dashboard__footer">
      <div class="footer-links">
        <For render={FooterLinkItem} of={footerLinks} />
      </div>
    </div>
  );
}
