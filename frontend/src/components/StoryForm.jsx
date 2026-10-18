import { useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import useGenres from "../useGenres";

const modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline"],
  ],
};
const formats = ["size", "bold", "italic", "underline"];
const MAX_MB = 2;

export default function StoryForm({
  heading,
  initialTitle = "",
  initialContent = "",
  initialCover = null,
  initialStatus = null,
  initialGenres = [],
  showStatus = false,
  submitLabel = "Save",
  onSubmit,
  error,
  extra,
}) {
  const genreList = useGenres();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [genres, setGenres] = useState(initialGenres); // slugs
  const [publishStatus, setPublishStatus] = useState(
    initialStatus === "coming_out" ? "coming_out" : "done",
  );
  const [cover, setCover] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInput = useRef(null);

  const isPublic = initialStatus === "done" || initialStatus === "coming_out";
  const newPreview = useMemo(
    () => (cover ? URL.createObjectURL(cover) : null),
    [cover],
  );
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

  function toggleGenre(slug) {
    setGenres(
      genres.includes(slug)
        ? genres.filter((g) => g !== slug)
        : [...genres, slug],
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Two submit buttons: the one that was pressed tells us "publish" or "draft".
    const asDraft = e.nativeEvent.submitter?.value === "draft";
    const status = showStatus ? (asDraft ? "draft" : publishStatus) : undefined;
    onSubmit(title, content, cover, removeCover, status, genres);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{heading}</h1>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
        required
      />

      <fieldset>
        <legend>Genres (choose any)</legend>
        <div className="genre-options">
          {genreList.map((g) => (
            <label key={g.slug}>
              <input
                type="checkbox"
                checked={genres.includes(g.slug)}
                onChange={() => toggleGenre(g.slug)}
              />{" "}
              {g.name}
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        Cover image (optional: JPEG, PNG or WEBP, up to {MAX_MB} MB)
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={chooseFile}
        />
      </label>
      {fileError && <p className="error">{fileError}</p>}
      {shown && (
        <>
          <img className="cover-preview" src={shown} alt="Cover preview" />
          <button type="button" className="secondary" onClick={clearCover}>
            Remove cover
          </button>
        </>
      )}

      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
      />
      {extra}
      {error && <p className="error">{error}</p>}

      {showStatus ? (
        <>
          <label>
            Publish as
            <select
              value={publishStatus}
              onChange={(e) => setPublishStatus(e.target.value)}
            >
              <option value="done">Done (a complete story)</option>
              <option value="coming_out">
                Coming out (still being written)
              </option>
            </select>
          </label>
          <button type="submit" value="publish">
            {isPublic ? "Save changes" : "Publish"}
          </button>
          <button type="submit" value="draft" className="secondary">
            {isPublic ? "Move to drafts" : "Save as draft"}
          </button>
        </>
      ) : (
        <button type="submit" value="publish">
          {submitLabel}
        </button>
      )}
    </form>
  );
}
