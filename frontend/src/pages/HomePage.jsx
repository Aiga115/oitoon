import { useEffect, useState } from "react";
import api from "../api";
import Hero from "../components/Hero";
import StoryTile from "../components/StoryTile";
import useGenres from "../useGenres";

export default function HomePage() {
  const genres = useGenres();
  const [search, setSearch] = useState(""); // what is typed
  const [applied, setApplied] = useState(""); // what was submitted
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [stories, setStories] = useState(null); // null = still loading

  useEffect(() => {
    const params = { sort };
    if (applied) params.search = applied;
    if (genre) params.genre = genre;
    if (status) params.status = status;
    api
      .get("/stories/", { params })
      .then((res) => setStories(res.data))
      .catch(() => setStories([]));
  }, [applied, genre, status, sort]);

  function clearFilters() {
    setSearch("");
    setApplied("");
    setGenre("");
    setStatus("");
    setSort("newest");
  }

  const filtering = applied || genre || status;

  return (
    <div>
      <Hero title="Oitoon" subtitle="Read a story a day, every day." />

      <form
        className="filters"
        onSubmit={(e) => {
          e.preventDefault();
          setApplied(search.trim());
        }}
      >
        <input
          type="search"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          aria-label="Genre"
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g.slug} value={g.slug}>
              {g.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Status"
        >
          <option value="">Any status</option>
          <option value="coming_out">Coming out</option>
          <option value="done">Done</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort"
        >
          <option value="newest">Newest</option>
          <option value="popular">Most popular</option>
        </select>
        <button type="submit">Search</button>
        {filtering && (
          <button type="button" className="secondary" onClick={clearFilters}>
            Clear
          </button>
        )}
      </form>

      {stories === null && <p>Loading...</p>}
      {stories && stories.length === 0 && (
        <p>{filtering ? "No stories match your search." : "No stories yet."}</p>
      )}
      {stories && (
        <div className="grid">
          {stories.map((s) => (
            <StoryTile key={s.id} story={s} />
          ))}
        </div>
      )}
    </div>
  );
}
