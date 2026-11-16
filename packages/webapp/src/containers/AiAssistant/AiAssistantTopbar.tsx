import { Button } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { Icon } from '@/components';

interface AiAssistantTopbarProps {
  title: string;
  model?: string;
  canDelete: boolean;
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onDelete: () => void;
}

export function AiAssistantTopbar({
  title,
  model,
  canDelete,
  onToggleSidebar,
  onNewChat,
  onDelete,
}: AiAssistantTopbarProps) {
  return (
    <header className="ai-topbar">
      <div className="ai-topbar__left">
        <Button
          minimal
          className="ai-topbar__menu"
          aria-label={intl.get('ai_assistant.open_sidebar')}
          title={intl.get('ai_assistant.open_sidebar')}
          onClick={onToggleSidebar}
        >
          <span className="ai-topbar__burger" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </Button>
        <span className="ai-topbar__title">
          {title || intl.get('ai_assistant.new_chat')}
        </span>
      </div>

      <div className="ai-topbar__right">
        {model ? <span className="ai-topbar__model">{model}</span> : null}
        <Button
          minimal
          className="ai-topbar__action"
          aria-label={intl.get('ai_assistant.new_chat')}
          title={intl.get('ai_assistant.new_chat')}
          icon={<Icon icon="plus-24" iconSize={16} />}
          onClick={onNewChat}
        />
        {canDelete ? (
          <Button
            minimal
            className="ai-topbar__action ai-topbar__action--danger"
            aria-label={intl.get('ai_assistant.delete')}
            title={intl.get('ai_assistant.delete')}
            icon={<Icon icon="trash-16" iconSize={15} />}
            onClick={onDelete}
          />
        ) : null}
      </div>
    </header>
  );
}
