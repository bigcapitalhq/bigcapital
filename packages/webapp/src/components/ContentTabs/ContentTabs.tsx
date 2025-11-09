// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { useUncontrolled } from '@/hooks/useUncontrolled';

const ContentTabsRoot = styled('div')`
  display: flex;
  gap: 10px;
`;
interface ContentTabItemRootProps {
  active?: boolean;
}
const ContentTabItemRoot = styled.button<ContentTabItemRootProps>`
  flex: 1 0;
  background: var(--color-card-background);
  border: 1px solid var(--color-content-tab-border);
  color: var(--color-content-tab-text);
  border-radius: 5px;
  padding: 11px;
  text-align: left;
  cursor: pointer;

  ${(props) =>
    props.small &&
    `
    padding: 8px 10px;
    `}

  ${(props) =>
    props.active &&
    `
      border-color: var(--color-content-tab-active-border);
      color: var(--color-content-tab-active-text);
      box-shadow: 0 0 0 0.25px #1552c8;

      ${ContentTabTitle} {
        font-weight: 500;
      }
      ${ContentTabDesc} {
      }
    `}
  &:hover,
  &:active {
    border-color: var(--color-content-tab-hover-border);
  }
`;
const ContentTabTitle = styled('h3')`
  font-size: 14px;
  font-weight: 400;
`;
const ContentTabDesc = styled('p')`
  margin: 0;
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.7;
`;

interface ContentTabsItemProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  active?: boolean;
  className?: string;
  small?: booean;
}

const ContentTabsItem = ({
  title,
  description,
  active,
  onClick,
  small,
  className,
}: ContentTabsItemProps) => {
  return (
    <ContentTabItemRoot
      active={active}
      onClick={onClick}
      className={className}
      small={small}
    >
      <ContentTabTitle>{title}</ContentTabTitle>
      {description && <ContentTabDesc>{description}</ContentTabDesc>}
    </ContentTabItemRoot>
  );
};

interface ContentTabsProps {
  initialValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
  small?: boolean;
}

export function ContentTabs({
  initialValue,
  value,
  onChange,
  children,
  className,
  small,
}: ContentTabsProps) {
  const [localValue, handleItemChange] = useUncontrolled<string>({
    initialValue,
    value,
    onChange,
    finalValue: '',
  });
  const tabs = React.Children.toArray(children);

  return (
    <ContentTabsRoot className={className}>
      {tabs.map((tab) => (
        <ContentTabsItem
          key={tab.key}
          {...tab.props}
          active={localValue === tab.props.id}
          onClick={() => handleItemChange(tab.props?.id)}
          small={small}
        />
      ))}
    </ContentTabsRoot>
  );
}

ContentTabs.Tab = ContentTabsItem;
