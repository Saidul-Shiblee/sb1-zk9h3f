"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Toggle } from "@/components/ui/toggle";
import { Bold, Italic, Underline as UnderlineIcon } from "lucide-react";
import { Toolbar } from "./toolbar";
import { ResizableImage } from "./extensions/resizable-image";

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ResizableImage.configure({
        HTMLAttributes: {
          class: "rounded-lg border border-gray-200 dark:border-gray-800",
        },
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline underline-offset-4 hover:text-primary/80",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert min-h-[500px]",
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          const file = event.dataTransfer.files[0];
          const fileReader = new FileReader();
          
          fileReader.onload = () => {
            const base64 = fileReader.result as string;
            const { tr } = view.state;
            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            
            if (coordinates) {
              view.dispatch(
                tr.insert(
                  coordinates.pos,
                  ResizableImage.create({ src: base64 }).type.create()
                )
              );
            }
          };
          
          fileReader.readAsDataURL(file);
          return true;
        }
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto border rounded-lg p-4">
      <Toolbar editor={editor} />

      {editor && (
        <BubbleMenu
          className="flex bg-background rounded-lg border shadow-lg overflow-hidden"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("underline")}
            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Toggle>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;