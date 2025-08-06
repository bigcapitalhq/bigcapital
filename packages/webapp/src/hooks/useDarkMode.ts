import { css } from '@emotion/css';
import { useState, useEffect } from 'react';

export const useIsDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check initial state on mount
    if (typeof window === 'undefined') return false;

    return (
      document.documentElement.classList.contains('bp4-dark') ||
      document.body.classList.contains('bp4-dark')
    );
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDarkMode = () => {
      const hasDarkClass =
        document.documentElement.classList.contains('bp4-dark') ||
        document.body.classList.contains('bp4-dark');
      setIsDarkMode(hasDarkClass);
    };

    // Create observer to watch for class changes on html and body elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          checkDarkMode();
        }
      });
    });

    // Observe both html and body elements for class changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Initial check
    checkDarkMode();

    // Cleanup observer on unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return isDarkMode;
};

export const darkMode = (styles: string) => css`
  .bp4-dark & {
    ${styles}
  }
`;
