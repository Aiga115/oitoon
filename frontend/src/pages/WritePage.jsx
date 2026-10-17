import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api, { errorText } from "../api";

// Only the formats the backend allows: size, bold, italic, underline.
// These are defined outside the component so they are not recreated on every keystroke.
const modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline"],
  ],
};
const formats = ["size", "bold", "italic", "underline"];

export default function WritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function handlePublish(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/stories/", { title, content });
      navigate("/");
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <form onSubmit={handlePublish}>
      <h1>Write a story</h1>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required />
      <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} />
      {error && <p className="error">{error}</p>}
      <button type="submit">Publish</button>
    </form>
  );
}