import { useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [[{ size: ["small", false, "large", "huge"] }], ["bold", "italic", "underline"]],
};
const formats = ["size", "bold", "italic", "underline"];
const MAX_MB = 2;

export default function StoryForm({ heading, initialTitle = "", initialContent = "", initialCover = null,
                                    submitLabel, onSubmit, error, extra }) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [cover, setCover] = useState(null);            // newly chosen file
  const [removeCover, setRemoveCover] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInput = useRef(null);

  const newPreview = useMemo(() => (cover ? URL.createObjectURL(cover) : null), [cover]);
  const shown = newPreview || (removeCover ? null : initialCover);

  function chooseFile(e) {
    const file = e.target.files[0];
    if (file && file.size > MAX_MB * 1024 * 1024) {
      setFileError(`The image must be ${MAX_MB} MB or smaller.`);
      e.target.value = "";
      return;
    }
    setFileError("");
    setCover(file || null);
    setRemoveCover(false);
  }

  function clearCover() {
    setCover(null);
    setRemoveCover(true);
    fileInput.current.value = "";
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(title, content, cover, removeCover); }}>
      <h1>{heading}</h1>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required />

      <label>
        Cover image (optional: JPEG, PNG or WEBP, up to {MAX_MB} MB)
        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} />
      </label>
      {fileError && <p className="error">{fileError}</p>}
      {shown && (
        <>
          <img className="cover-preview" src={shown} alt="Cover preview" />
          <button type="button" className="secondary" onClick={clearCover}>Remove cover</button>
        </>
      )}

      <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} />
      {extra}
      {error && <p className="error">{error}</p>}
      <button type="submit">{submitLabel}</button>
    </form>
  );
}