import React from 'react';
import { ShortcutBoxesSection } from './ShortcutBoxesSection';
import { productsServices } from '@/constants/homepageOptions';

export function ProductsServicesSection() {
  return <ShortcutBoxesSection section={productsServices} />;
}
