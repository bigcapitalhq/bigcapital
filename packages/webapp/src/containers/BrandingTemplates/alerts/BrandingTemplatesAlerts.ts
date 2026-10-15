import React from 'react';

const DeleteBrandingTemplateAlert = React.lazy(() =>
  import('./DeleteBrandingTemplateAlert').then((m) => ({
    default: m.DeleteBrandingTemplateAlert,
  })),
);

const MarkDefaultBrandingTemplateAlert = React.lazy(() =>
  import('./MarkDefaultBrandingTemplateAlert').then((m) => ({
    default: m.MarkDefaultBrandingTemplateAlert,
  })),
);

export const BrandingTemplatesAlerts = [
  { name: 'branding-template-delete', component: DeleteBrandingTemplateAlert },
  {
    name: 'branding-template-mark-default',
    component: MarkDefaultBrandingTemplateAlert,
  },
];
