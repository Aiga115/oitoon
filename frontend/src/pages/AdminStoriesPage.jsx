import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../api";
import { formatDate } from "../utils";

export default function AdminStoriesPage() {
  const [stories, setStories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/stories/").then((res) => setStories(res.data)).catch((err) => setError(errorText(err)));
  }, []);

  async function togglePublished(s) {
    try {
      const res = await api.patch(`/admin/stories/${s.id}/`, { is_published: !s.is_published });
      setStories(stories.map((x) => (x.id === s.id ? res.data : x)));
      setError("");
    } catch (err) {
      setError(errorText(err));
    }
  }

  async function remove(s) {
    if (!window.confirm(`Delete "${s.title}"?`)) return;
    try {
      await api.delete(`/admin/stories/${s.id}/`);
      setStories(stories.filter((x) => x.id !== s.id));
      setError("");
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <div>
      <h1>Stories</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr><th>ID</th><th>Title</th><th>Author</th><th>Created</th><th>Status</th><th>Ratings</th><th></th></tr>
        </thead>
        <tbody>
          {stories.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td><Link to={`/admin/stories/${s.id}`}>{s.title}</Link></td>
              <td>{s.author_username}</td>
              <td>{formatDate(s.created_at)}</td>
              <td>{s.is_published ? "Published" : "Unpublished"}</td>
              <td>{s.rating_count}</td>
              <td>
                <button onClick={() => togglePublished(s)}>{s.is_published ? "Unpublish" : "Publish"}</button>{" "}
                <button onClick={() => remove(s)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}