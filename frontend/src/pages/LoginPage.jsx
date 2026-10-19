import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { errorText } from "../api";

export default function LoginPage({ isAdmin = false }) {
  const { loginUser, loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (isAdmin) {
        await loginAdmin(username, password);
        navigate("/admin/users");
      } else {
        await loginUser(username, password);
        navigate("/");
      }
    } catch (err) {
      setError(errorText(err));   // shows the backend's message, also for the wrong door
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{isAdmin ? "Admin log in" : "Log in"}</h1>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p className="error">{error}</p>}
      <button type="submit">Log in</button>
    </form>
  );
}