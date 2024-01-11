// @ts-nocheck
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useUncontrolled } from '@/hooks/useUncontrolled';
import { Box } from '../Layout/Box';
import './RichEditor.style.scss';

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
    onChange,
    finalValue: '',
  });

  const handleBlur = ({ editor }) => {
    handleChange(editor.getHTML());
  };

  return (
    <Box className={className}>
      <EditorProvider
        extensions={extensions}
        content={content}
        onBlur={handleBlur}
      />
    </Box>
  );
};
