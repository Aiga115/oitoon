import { useEffect, useState } from "react";
import api from "../api";
import Hero from "../components/Hero";
import StoryTile from "../components/StoryTile";

export default function MyStoriesPage() {
  const [stories, setStories] = useState(null);

  useEffect(() => {
    api
      .get("/stories/", { params: { mine: 1 } })
      .then((res) => setStories(res.data))
      .catch(() => setStories([]));
  }, []);

  if (stories === null) return <p>Loading...</p>;

  return (
    <div>
      <Hero title="My stories" subtitle="Drafts and published stories" />
      {stories.length === 0 && <p>You have not written anything yet.</p>}
      <div className="grid">
        {stories.map((s) => (
          <StoryTile key={s.id} story={s} />
        ))}
      </div>
    </div>
  );
}
