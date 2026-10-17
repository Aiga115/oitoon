import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { formatDate, ratingText } from "../utils";

export default function HomePage() {
  const [stories, setStories] = useState(null);   // null = still loading

  useEffect(() => {
    api.get("/stories/").then((res) => setStories(res.data)).catch(() => setStories([]));
  }, []);

  if (stories === null) return <p>Loading...</p>;

  return (
    <div>
      <h1>Stories</h1>
      {stories.length === 0 && <p>No stories yet.</p>}
      {stories.map((s) => (
        <div key={s.id} className="story-card">
          <h3><Link to={`/stories/${s.id}`}>{s.title}</Link></h3>
          <small>
            by <Link to={`/authors/${s.author_username}`}>{s.author_username}</Link> · {formatDate(s.created_at)} · {ratingText(s)}
          </small>
          <p>{s.excerpt}</p>
        </div>
      ))}
    </div>
  );
}