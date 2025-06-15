"use client";

import "quill/dist/quill.snow.css";
import {forwardRef, useEffect, useImperativeHandle, useRef} from "react";

export type QuillEditorRef = {
  setContents: (html: string) => void;
};

type QuillEditorProps = {
  initialContent: string;
  onChange: (html: string) => void;
};

const QuillEditor = forwardRef<QuillEditorRef, QuillEditorProps>(
  ({initialContent, onChange}, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillInstanceRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      setContents: (html: string) => {
        if (quillInstanceRef.current) {
          quillInstanceRef.current.root.innerHTML = html;
        }
      },
    }));

    useEffect(() => {
      const loadQuill = async () => {
        const Quill = (await import("quill")).default;

        if (editorRef.current && !quillInstanceRef.current) {
          quillInstanceRef.current = new Quill(editorRef.current, {
            theme: "snow",
            modules: {
              toolbar: [
                [{header: [1, 2, 3, 4, 5, false]}],
                ["bold", "italic", "underline"],
                [{list: "ordered"}, {list: "bullet"}],
              ],
            },
          });

          if (initialContent) {
            quillInstanceRef.current.root.innerHTML = initialContent;
          }

          quillInstanceRef.current.on("text-change", () => {
            const html = quillInstanceRef.current.root.innerHTML;
            onChange?.(html);
          });
        }
      };

      if (typeof window !== "undefined") {
        loadQuill();
      }
    }, [initialContent, onChange]);

    return (
      <div className="rounded-xl m-2 py-5 px-4 h-[300px]">
        <div ref={editorRef} style={{height: "100%"}} />
      </div>
    );
  }
);

export default QuillEditor;

