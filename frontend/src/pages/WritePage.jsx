import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errorText } from "../api";
import StoryForm from "../components/StoryForm";
import { storyFormData } from "../utils";

export default function WritePage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSave(title, content, cover, removeCover, status, genres) {
    setError("");
    try {
      const res = await api.post("/stories/", storyFormData(title, content, cover, false, { status, genres }));
      navigate(status === "draft" ? "/my-stories" : `/stories/${res.data.id}`);
    } catch (err) {
      setError(errorText(err));
    }
  }

  return <StoryForm heading="Write a story" showStatus onSubmit={handleSave} error={error} />;
}