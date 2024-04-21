// @ts-nocheck
import React from 'react';
import { getFooterLinks } from '@/constants/footerLinks';
import { For } from '@/components';

function FooterLinkItem({ title, link }) {
  return (
    <div className="">
      <a href={link} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
    </div>
  );
}

export default function DashboardFooter() {
  const footerLinks = getFooterLinks();

  return (
    <div className="dashboard__footer">
      <div className="footer-links">
        <For render={FooterLinkItem} of={footerLinks} />
      </div>
    </div>
  );
}
