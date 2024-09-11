// @ts-nocheck
import React from 'react';

const DeleteBrandingTemplateAlert = React.lazy(
  () => import('./DeleteBrandingTemplateAlert'),
);

export const BrandingTemplatesAlerts = [
  { name: 'branding-template-delete', component: DeleteBrandingTemplateAlert },
];
