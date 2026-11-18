import { Tab, Tabs } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { useState } from 'react';
import intl from 'react-intl-universal';
import { ItemFormSections } from './ItemFormFields';
import { ItemFormFloatingActions } from './ItemFormFloatingActions';
import { useItemFormContext } from './ItemFormProvider';
import { Card, Group } from '@/components';

export function ItemFormContent() {
  const [selectedTabId, setSelectedTabId] = useState<string>('primary');
  const { itemImagesEnabled } = useItemFormContext();

  const handleTabChange = (tabId: string) => {
    const sectionId = String(tabId);
    setSelectedTabId(sectionId);

    const section = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card
      className={css`
        padding-bottom: 0 !important;
      `}
    >
      <Group
        verticalAlign={'top'}
        alignItems={'flex-start'}
        flexWrap={'nowrap'}
      >
        <Tabs
          selectedTabId={selectedTabId}
          onChange={handleTabChange}
          className={css`
            position: sticky;
            top: 20px;
          `}
          vertical
        >
          <Tab id={'primary'} title={'Basic'} />
          <Tab id={'selling'} title={'Selling'} />
          <Tab id={'purchasing'} title={'Purchasing'} />
          <Tab id={'inventory'} title={'Inventory'} />
          {itemImagesEnabled ? (
            <Tab
              id={'images'}
              title={intl.get('item_images', { fallback: 'Images' })}
            />
          ) : null}
        </Tabs>

        <ItemFormSections />
      </Group>
      <ItemFormFloatingActions />
    </Card>
  );
}
