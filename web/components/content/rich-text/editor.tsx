import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./toolbar/editor-toolbar";
import { useEffect } from "react";

// Code taken from https://github.com/sravimohan/shandcn-ui-extensions/tree/main/components/rich-text

interface EditorProps {
  content: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const Editor = ({ content, placeholder, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        class: "p-1 leading-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: true,
  });

  // This useEffect renders the markdown content into editor box using TipTap's setContent command for <EditorContent>
  useEffect(() => {
    if (!editor) return;

    if (!content) {
      editor.commands.clearContent();
    } else {
      editor.commands.setContent(content, false, {
        preserveWhitespace: "full",
      });
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="prose max-w-none w-full border border-input bg-background dark:prose-invert">
      <EditorToolbar editor={editor} />
      <div className="editor">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
};

export default Editor;
