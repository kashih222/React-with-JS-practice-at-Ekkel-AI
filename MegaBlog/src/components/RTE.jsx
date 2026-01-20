import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { Controller } from "react-hook-form";

export default function RTE({ name, control, label}) {
  const editorRef = useRef(null);
  

  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1 ">{label}</label>}
      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey="no-api-key"
            onInit={(_evt, editor) => (editorRef.current = editor)}
            initialValue=""
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "preview",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }} 
            onEditorChange={onChange}
          />
          
        )}
      />
    </div>
  );
}
