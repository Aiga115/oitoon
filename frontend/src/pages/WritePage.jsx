import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errorText } from "../api";
import StoryForm from "../components/StoryForm";
import { storyFormData } from "../utils";

export default function WritePage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handlePublish(title, content, cover) {
    setError("");
    try {
      const res = await api.post(
        "/stories/",
        storyFormData(title, content, cover),
      );
      navigate(`/stories/${res.data.id}`);
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <StoryForm
      heading="Write a story"
      submitLabel="Publish"
      onSubmit={handlePublish}
      error={error}
    />
  );
}
