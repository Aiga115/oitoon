import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errorText } from "../api";
import StoryForm from "../components/StoryForm";

export default function WritePage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handlePublish(title, content) {
    setError("");
    try {
      const res = await api.post("/stories/", { title, content });
      navigate(`/stories/${res.data.id}`);   // go to the new story
    } catch (err) {
      setError(errorText(err));
    }
  }

  return <StoryForm heading="Write a story" submitLabel="Publish" onSubmit={handlePublish} error={error} />;
}