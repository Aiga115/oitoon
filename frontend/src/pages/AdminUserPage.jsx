import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { errorText } from "../api";
import { useAuth } from "../AuthContext";
import { formatDate } from "../utils";

export default function AdminUserPage() {
  const { id } = useParams();
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [u, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/admin/users/${id}/`).then((res) => setUser(res.data)).catch((err) => setError(errorText(err)));
  }, [id]);

  async function remove() {
    if (!window.confirm(`Delete ${u.username} and all their stories and ratings?`)) return;
    try {
      await api.delete(`/admin/users/${id}/`);
      navigate("/admin/users");
    } catch (err) {
      setError(errorText(err));
    }
  }

  if (!u) return error ? <p className="error">{error}</p> : <p>Loading...</p>;

  return (
    <div>
      <p><Link to="/admin/users">← All users</Link></p>
      <h1>{u.username}</h1>
      <p>ID: {u.id}</p>
      <p>Staff: {u.is_staff ? "Yes" : "No"} · Superuser: {u.is_superuser ? "Yes" : "No"}</p>
      <p>Joined: {formatDate(u.date_joined)} · Last login: {u.last_login ? formatDate(u.last_login) : "never"}</p>
      <p>Stories: {u.story_count} · Ratings given: {u.rating_count}</p>
      {error && <p className="error">{error}</p>}
      {!u.is_superuser && u.username !== admin && <button onClick={remove}>Delete user</button>}
    </div>
  );
}