// @ts-nocheck
import './styles.scss';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Box } from '@/components';
import styled from 'styled-components';
import { useUncontrolled } from '@/hooks/useUncontrolled';

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

export interface RichEditorProps {
  value?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}
export const RichEditor = ({
  value,
  initialValue,
  onChange,
  className,
}: RichEditorProps) => {
  const [content, handleChange] = useUncontrolled({
    value,
    initialValue,
    finalValue: '',
    onChange,
  });

  return (
    <Root>
      <EditorProvider
        extensions={extensions}
        content={content}
        onBlur={handleChange}
      />
    </Root>
  );
};

const Root = styled(Box)`
  padding: 15px;
  border: 1px solid #dedfe9;
  border-top: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;
