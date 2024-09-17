import React, { createContext, useContext } from 'react';

interface ElementCustomizeValue {
  PaperTemplate?: React.ReactNode;
  CustomizeTabs: React.ReactNode;
}

const ElementCustomizeContext = createContext<ElementCustomizeValue>(
  {} as ElementCustomizeValue,
);

export const ElementCustomizeProvider: React.FC<{
  value: ElementCustomizeValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
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
