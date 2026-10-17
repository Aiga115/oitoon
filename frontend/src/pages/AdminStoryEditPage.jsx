import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { errorText } from "../api";
import StoryForm from "../components/StoryForm";

export default function AdminStoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [published, setPublished] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/admin/stories/${id}/`)
      .then((res) => { setStory(res.data); setPublished(res.data.is_published); })
      .catch((err) => setError(errorText(err)));
  }, [id]);

  async function handleSave(title, content) {
    setError("");
    try {
      await api.put(`/admin/stories/${id}/`, { title, content, is_published: published });
      navigate("/admin/stories");
    } catch (err) {
      setError(errorText(err));
    }
  }

  if (!story) return error ? <p className="error">{error}</p> : <p>Loading...</p>;

  return (
    <StoryForm
      heading={`Edit story by ${story.author_username}`}
      initialTitle={story.title}
      initialContent={story.content}
      submitLabel="Save"
      onSubmit={handleSave}
      error={error}
      extra={
        <label>
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Published
        </label>
      }
    />
  );
}