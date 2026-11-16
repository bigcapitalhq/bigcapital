import { Radio, RadioGroup } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import type { DarkStyle } from '@/utils/theme-preference';
import { useDarkStyle } from '@/hooks/useThemePreference';
import { DARK_STYLES, parseDarkStyle } from '@/utils/theme-preference';

/**
 * Dark style: which palette to use whenever the theme is dark.
 */
export function DarkStyleSetting() {
  const { darkStyle, setDarkStyle } = useDarkStyle();

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setDarkStyle(parseDarkStyle(event.currentTarget.value));
  };

  return (
    <section data-testId="appearance-dark-style-setting">
      <h3>{intl.get('appearance.dark_style.title')}</h3>
      <Description>{intl.get('appearance.dark_style.description')}</Description>
      <RadioGroup selectedValue={darkStyle} onChange={handleChange}>
        {DARK_STYLES.map((style) => (
          <Radio
            key={style}
            value={style}
            labelElement={
              <Option>
                <DarkStyleSwatch darkStyle={style} />
                {intl.get(`appearance.dark_style.${style}`)}
              </Option>
            }
          />
        ))}
      </RadioGroup>
    </section>
  );
}

/**
 * A small preview of a dark style: page, panel and accent colors.
 */
function DarkStyleSwatch({ darkStyle }: { darkStyle: DarkStyle }) {
  return (
    <Swatch
      aria-hidden
      style={
        {
          '--swatch-page': `var(--color-dark-style-${darkStyle}-page)`,
          '--swatch-panel': `var(--color-dark-style-${darkStyle}-panel)`,
          '--swatch-accent': `var(--color-dark-style-${darkStyle}-accent)`,
        } as React.CSSProperties
      }
    >
      <span />
    </Swatch>
  );
}

const Description = styled.p`
  line-height: 1.55;
  margin-bottom: 12px;
`;

const Option = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const Swatch = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: 36px;
  height: 20px;
  padding: 0 5px;
  border-radius: 4px;
  background: var(--swatch-page);
  box-shadow: inset 0 0 0 1px rgba(127, 127, 127, 0.35);

  span {
    width: 16px;
    height: 10px;
    border-radius: 2px;
    background: var(--swatch-panel);
    border-left: 3px solid var(--swatch-accent);
  }
`;
