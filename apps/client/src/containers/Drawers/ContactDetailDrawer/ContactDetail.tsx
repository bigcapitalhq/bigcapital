// @ts-nocheck
import React from 'react';
import ContactDetailActionsBar from './ContactDetailActionsBar';
import ContactDetailList from './ContactDetailList';
import { Card } from '@/components';

/**
 * contact detail.
 */
export default function ContactDetail() {
  return (
    <div className="view-detail-drawer">
      <ContactDetailActionsBar />
      <Card>
        <ContactDetailList />
      </Card>
    </div>
  );
}
