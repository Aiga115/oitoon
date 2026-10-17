import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../api";
import { useAuth } from "../AuthContext";
import { formatDate } from "../utils";

export default function AdminUsersPage() {
  const { admin } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/users/").then((res) => setUsers(res.data)).catch((err) => setError(errorText(err)));
  }, []);

  async function remove(u) {
    if (!window.confirm(`Delete ${u.username} and all their stories and ratings?`)) return;
    try {
      await api.delete(`/admin/users/${u.id}/`);
      setUsers(users.filter((x) => x.id !== u.id));
      setError("");
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <div>
      <h1>Users</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr><th>ID</th><th>Username</th><th>Staff</th><th>Superuser</th><th>Joined</th><th>Stories</th><th>Ratings</th><th></th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td><Link to={`/admin/users/${u.id}`}>{u.username}</Link></td>
              <td>{u.is_staff ? "Yes" : "No"}</td>
              <td>{u.is_superuser ? "Yes" : "No"}</td>
              <td>{formatDate(u.date_joined)}</td>
              <td>{u.story_count}</td>
              <td>{u.rating_count}</td>
              <td>
                {/* The backend refuses these two cases anyway; the button is hidden for clarity. */}
                {!u.is_superuser && u.username !== admin && <button onClick={() => remove(u)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}