import { useEffect, useState } from "react";
import api from "../api";

export default function HomePage() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    api.get("/stories/").then((res) => setStories(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1>Stories</h1>
      {stories.length === 0 && <p>No stories yet.</p>}
      {stories.map((s) => (
        <div key={s.id}>
          <b>{s.title}</b> by {s.author_username}
          <p>{s.excerpt}</p>
        </div>
      ))}
    </div>
  );
}