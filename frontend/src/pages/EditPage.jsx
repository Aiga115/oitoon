import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { errorText } from "../api";
import { useAuth } from "../AuthContext";
import StoryForm from "../components/StoryForm";
import { storyFormData } from "../utils";

export default function EditPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/stories/${id}/`)
      .then((res) => setStory(res.data))
      .catch(() => setError("Story not found."));
  }, [id]);

  async function handleSave(
    title,
    content,
    cover,
    removeCover,
    status,
    genres,
  ) {
    setError("");
    try {
      await api.put(
        `/stories/${id}/`,
        storyFormData(title, content, cover, removeCover, { status, genres }),
      );
      navigate(status === "draft" ? "/my-stories" : `/stories/${id}`);
    } catch (err) {
      setError(errorText(err));
    }
  }

  if (!story)
    return error ? <p className="error">{error}</p> : <p>Loading...</p>;
  if (story.author_username !== user)
    return <p className="error">You can only edit your own stories.</p>;

  return (
    <StoryForm
      heading="Edit story"
      initialTitle={story.title}
      initialContent={story.content}
      initialCover={story.cover}
      initialStatus={story.status}
      initialGenres={story.genres}
      showStatus
      onSubmit={handleSave}
      error={error}
    />
  );
}
