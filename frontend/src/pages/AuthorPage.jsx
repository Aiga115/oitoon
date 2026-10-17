import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { formatDate, ratingText } from "../utils";

export default function AuthorPage() {
  const { username } = useParams();
  const [author, setAuthor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/authors/${username}/`).then((res) => setAuthor(res.data)).catch(() => setError("Author not found."));
  }, [username]);

  if (!author) return error ? <p className="error">{error}</p> : <p>Loading...</p>;

  return (
    <div>
      <h1>{author.username}</h1>
      <small>Member since {formatDate(author.date_joined)} · {author.stories.length} stories</small>
      {author.stories.map((s) => (
        <div key={s.id} className="story-card">
          <h3><Link to={`/stories/${s.id}`}>{s.title}</Link></h3>
          <small>{formatDate(s.created_at)} · {ratingText(s)}</small>
          <p>{s.excerpt}</p>
        </div>
      ))}
    </div>
  );
}