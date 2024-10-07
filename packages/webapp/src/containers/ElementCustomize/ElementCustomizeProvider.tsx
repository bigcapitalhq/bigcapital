import React, { createContext, useContext } from 'react';
import { ElementPreviewState } from '../BrandingTemplates/types';

interface ElementCustomizeValue {
  PaperTemplate?: React.ReactNode;
  CustomizeTabs: React.ReactNode;
  brandingState?: ElementPreviewState;
}

const ElementCustomizeContext = createContext<ElementCustomizeValue>(
  {} as ElementCustomizeValue,
);

interface ElementCustomizeProviderProps {
  value: ElementCustomizeValue;
  children: React.ReactNode;
}

export const ElementCustomizeProvider = ({ value, children }: ElementCustomizeProviderProps) => {
  return (
    <ElementCustomizeContext.Provider value={{ ...value }}>
      {children}
    </ElementCustomizeContext.Provider>
  );
};

export const useElementCustomizeContext = (): ElementCustomizeValue => {
  const context = useContext<ElementCustomizeValue>(ElementCustomizeContext);

  if (!context) {
    throw new Error(
      'useElementCustomize must be used within an ElementCustomizeProvider',
    );
  }
  return context;
};