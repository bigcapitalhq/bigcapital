import React from 'react';
import { Link } from 'react-router-dom';
import { useFilterShortcutBoxesSection } from './components';
import type {
  HomepageSectionOption,
  HomepageShortcutOption,
} from '@/constants/types';
import { For } from '@/components';
import '@/style/pages/FinancialStatements/FinancialSheets.scss';

interface ShortcutBoxProps {
  title: React.ReactNode;
  link: string;
  description: React.ReactNode;
}

function ShortcutBox({ title, link, description }: ShortcutBoxProps) {
  return (
    <div className={'financial-reports__item'}>
      <Link className="title" to={link}>
        {title}
      </Link>
      <p className="desc">{description}</p>
    </div>
  );
}

interface ShortcutBoxesProps {
  sectionTitle: React.ReactNode;
  shortcuts: HomepageShortcutOption[];
}

function ShortcutBoxes({ sectionTitle, shortcuts }: ShortcutBoxesProps) {
  return (
    <div className="financial-reports__section">
      <div className="section-title">{sectionTitle}</div>
      <div className="financial-reports__list">
        <For render={ShortcutBox} of={shortcuts} />
      </div>
    </div>
  );
}

interface ShortcutBoxesSectionProps {
  section: HomepageSectionOption[];
}

export function ShortcutBoxesSection({ section }: ShortcutBoxesSectionProps) {
  const BoxSection = useFilterShortcutBoxesSection(section);
  return <For render={ShortcutBoxes} of={BoxSection} />;
}
