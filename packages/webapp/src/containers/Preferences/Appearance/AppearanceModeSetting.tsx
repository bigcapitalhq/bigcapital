import { Radio, RadioGroup } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useThemePreference } from '@/hooks/useThemePreference';
import {
  THEME_PREFERENCES,
  parseThemePreference,
} from '@/utils/theme-preference';

/**
 * Appearance mode: follow the system, or always light or dark.
 * Bound to the same preference as the avatar-menu switch.
 */
export function AppearanceModeSetting() {
  const { preference, setThemePreference } = useThemePreference();

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setThemePreference(parseThemePreference(event.currentTarget.value));
  };

  return (
    <section data-testId="appearance-mode-setting">
      <h3>{intl.get('appearance.mode')}</h3>
      <Description>{intl.get('appearance.mode_description')}</Description>
      <RadioGroup selectedValue={preference} onChange={handleChange}>
        {THEME_PREFERENCES.map((value) => (
          <Radio
            key={value}
            value={value}
            label={intl.get(`appearance.${value}`)}
          />
        ))}
      </RadioGroup>
    </section>
  );
}

const Description = styled.p`
  line-height: 1.55;
  margin-bottom: 12px;
`;
