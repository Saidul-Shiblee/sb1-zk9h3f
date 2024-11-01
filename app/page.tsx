import TiptapEditor from "@/components/editor/tiptap-editor";

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-center">Rich Text Editor</h1>
        <p className="text-muted-foreground text-center">
          A full-featured WYSIWYG editor with image resizing capabilities
        </p>
        <TiptapEditor />
      </div>
    </main>
  );
}