import { useEffect, useState } from "react";
import api from "../api";
import Hero from "../components/Hero";
import StoryTile from "../components/StoryTile";

export default function HomePage() {
  const [stories, setStories] = useState(null); // null = still loading

  useEffect(() => {
    api
      .get("/stories/")
      .then((res) => setStories(res.data))
      .catch(() => setStories([]));
  }, []);

  if (stories === null) return <p>Loading...</p>;

  return (
    <div>
      <Hero title="Oitoon" subtitle="Read a story a day, every day." />
      {stories.length === 0 && <p>No stories yet.</p>}
      <div className="grid">
        {stories.map((s) => (
          <StoryTile key={s.id} story={s} />
        ))}
      </div>
    </div>
  );
}
