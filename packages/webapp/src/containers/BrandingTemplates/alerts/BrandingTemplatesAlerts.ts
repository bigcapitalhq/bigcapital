// @ts-nocheck
import React from 'react';

const DeleteBrandingTemplateAlert = React.lazy(
  () => import('./DeleteBrandingTemplateAlert'),
);

const MarkDefaultBrandingTemplateAlert = React.lazy(
  () => import('./MarkDefaultBrandingTemplateAlert'),
);

export const BrandingTemplatesAlerts = [
  { name: 'branding-template-delete', component: DeleteBrandingTemplateAlert },
  {
    name: 'branding-template-mark-default',
    component: MarkDefaultBrandingTemplateAlert,
  },
];
