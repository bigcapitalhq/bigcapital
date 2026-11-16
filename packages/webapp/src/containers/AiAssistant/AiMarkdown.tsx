import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './AiMarkdown.module.scss';

interface AiMarkdownProps {
  children: string;
}

/**
 * Renders assistant markdown. Raw HTML is intentionally not enabled.
 */
export function AiMarkdown({ children }: AiMarkdownProps) {
  return (
    <div className={styles.markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node: _node, children, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          table: ({ node: _node, ...props }) => (
            <div className={styles.tableWrap}>
              <table {...props} />
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
