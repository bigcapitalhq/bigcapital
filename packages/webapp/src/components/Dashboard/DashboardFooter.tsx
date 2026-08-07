import React from 'react';
import { For } from '@/components';
import { getFooterLinks } from '@/constants/footerLinks';

interface FooterLinkItemProps {
  title: string;
  link: string;
}

function FooterLinkItem({ title, link }: FooterLinkItemProps) {
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
