import { useEffect, useState } from "react";
import api, { errorText } from "../api";
import Hero from "../components/Hero";
import StoryTile from "../components/StoryTile";

export default function RecommendedPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/recommendations/")
      .then((res) => setData(res.data))
      .catch((err) => setError(errorText(err)));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  const personal = data.mode === "personalised";

  return (
    <div>
      <Hero
        title="Recommended"
        subtitle={
          personal
            ? "Picked for you from the ratings of similar stories"
            : "Top-rated stories"
        }
      />
      {!personal && data.ratings_given < 3 && (
        <p className="notice">
          You have rated {data.ratings_given}{" "}
          {data.ratings_given === 1 ? "story" : "stories"}. Rate at least 3 to
          get personal recommendations. Until then, here are the top-rated
          stories.
        </p>
      )}
      {!personal && data.ratings_given >= 3 && (
        <p className="notice">
          No personal match yet, so here are the top-rated stories.
        </p>
      )}
      {data.results.length === 0 && <p>Nothing to recommend yet.</p>}
      <div className="grid">
        {data.results.map((s) => (
          <StoryTile key={s.id} story={s} />
        ))}
      </div>
    </div>
  );
}
