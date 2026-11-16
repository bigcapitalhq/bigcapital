import { Button, Spinner } from '@blueprintjs/core';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import type { AiConversationSummary } from '@/hooks/query/ai-assistant';
import { Icon } from '@/components';

interface AiAssistantSidebarProps {
  conversations: AiConversationSummary[];
  currentId: number | null;
  isLoading: boolean;
  model?: string;
  isOpen: boolean;
  onNewChat: () => void;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

const formatUpdatedAt = (value: string): string => {
  const date = moment(value);
  return date.isValid() ? date.fromNow() : '';
};

export function AiAssistantSidebar({
  conversations,
  currentId,
  isLoading,
  model,
  isOpen,
  onNewChat,
  onSelect,
  onDelete,
  onClose,
}: AiAssistantSidebarProps) {
  return (
    <aside className={`ai-sidebar ${isOpen ? 'ai-sidebar--open' : ''}`}>
      <div className="ai-sidebar__head">
        <div className="ai-sidebar__brand">
          <div className="ai-sidebar__logo">
            <Icon icon="star-18dp" iconSize={16} />
          </div>
          <span>{intl.get('ai_assistant.title')}</span>
        </div>
        <Button
          minimal
          className="ai-sidebar__close"
          aria-label={intl.get('ai_assistant.close')}
          title={intl.get('ai_assistant.close')}
          icon={<Icon icon="times-circle" iconSize={16} />}
          onClick={onClose}
        />
      </div>

      <Button
        fill
        className="ai-sidebar__new"
        icon={<Icon icon="plus-24" iconSize={14} />}
        onClick={onNewChat}
      >
        {intl.get('ai_assistant.new_chat')}
      </Button>

      <div className="ai-sidebar__label">
        {intl.get('ai_assistant.history_title')}
      </div>

      <div className="ai-sidebar__list">
        {isLoading ? (
          <div className="ai-sidebar__loading">
            <Spinner size={18} />
          </div>
        ) : conversations.length === 0 ? (
          <div className="ai-sidebar__empty">
            {intl.get('ai_assistant.history_empty')}
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`ai-sidebar__item ${
                conversation.id === currentId ? 'ai-sidebar__item--active' : ''
              }`}
            >
              <button
                type="button"
                className="ai-sidebar__item-main"
                title={conversation.title || undefined}
                onClick={() => onSelect(conversation.id)}
              >
                <span className="ai-sidebar__item-title">
                  {conversation.title || intl.get('ai_assistant.untitled')}
                </span>
                <span className="ai-sidebar__item-date">
                  {formatUpdatedAt(conversation.updatedAt)}
                </span>
              </button>
              <Button
                minimal
                small
                className="ai-sidebar__item-delete"
                aria-label={intl.get('ai_assistant.delete')}
                title={intl.get('ai_assistant.delete')}
                icon={<Icon icon="trash-16" iconSize={13} />}
                onClick={() => onDelete(conversation.id)}
              />
            </div>
          ))
        )}
      </div>

      <div className="ai-sidebar__footer">
        <span className="ai-sidebar__footer-dot" />
        <span>{model || intl.get('ai_assistant.model_fallback')}</span>
      </div>
    </aside>
  );
}
