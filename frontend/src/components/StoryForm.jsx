import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Only the formats the backend whitelist keeps.
const modules = {
  toolbar: [[{ size: ["small", false, "large", "huge"] }], ["bold", "italic", "underline"]],
};
const formats = ["size", "bold", "italic", "underline"];

export default function StoryForm({ heading, initialTitle = "", initialContent = "", submitLabel, onSubmit, error, extra }) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(title, content); }}>
      <h1>{heading}</h1>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required />
      <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} />
      {extra}
      {error && <p className="error">{error}</p>}
      <button type="submit">{submitLabel}</button>
    </form>
  );
}