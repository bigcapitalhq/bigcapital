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
  background: #fff;
  border: 1px solid #e1e2e8;
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
      border-color: #1552c8;
      box-shadow: 0 0 0 0.25px #1552c8;

      ${ContentTabTitle} {
        color: #1552c8;
        font-weight: 500;
      }
      ${ContentTabDesc} {
        color: #1552c8;        
      }
    `}
  &:hover,
  &:active {
    border-color: #1552c8;
  }
`;
const ContentTabTitle = styled('h3')`
  font-size: 14px;
  font-weight: 400;
  color: #2f343c;
`;
const ContentTabDesc = styled('p')`
  margin: 0;
  color: #5f6b7c;
  margin-top: 4px;
  font-size: 12px;
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
