import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { formatDate } from "../utils";
import Hero from "../components/Hero";
import StoryTile from "../components/StoryTile";

export default function AuthorPage() {
  const { username } = useParams();
  const [author, setAuthor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/authors/${username}/`)
      .then((res) => setAuthor(res.data))
      .catch(() => setError("Author not found."));
  }, [username]);

  if (!author)
    return error ? <p className="error">{error}</p> : <p>Loading...</p>;

  return (
    <div>
      <Hero
        title={author.username}
        subtitle={`Member since ${formatDate(author.date_joined)} · ${author.stories.length} stories`}
      />
      <div className="grid">
        {author.stories.map((s) => (
          <StoryTile key={s.id} story={s} />
        ))}
      </div>
    </div>
  );
}
