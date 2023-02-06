// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { For } from '@/components';

import '@/style/pages/FinancialStatements/FinancialSheets.scss';
import { useFilterShortcutBoxesSection } from './components';

function ShortcutBox({ title, link, description }) {
  return (
    <div className={'financial-reports__item'}>
      <Link className="title" to={link}>
        {title}
      </Link>
      <p className="desc">{description}</p>
    </div>
  );
}

function ShortcutBoxes({ sectionTitle, shortcuts }) {
  return (
    <div className="financial-reports__section">
      <div className="section-title">{sectionTitle}</div>
      <div className="financial-reports__list">
        <For render={ShortcutBox} of={shortcuts} />
      </div>
    </div>
  );
}

export default function ShortcutBoxesSection({ section }) {
  const BoxSection = useFilterShortcutBoxesSection(section);
  return <For render={ShortcutBoxes} of={BoxSection} />;
}
