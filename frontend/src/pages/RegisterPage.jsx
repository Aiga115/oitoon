import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { errorText } from "../api";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(username, password);
      navigate("/");
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign up</h1>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password (at least 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
      {error && <p className="error">{error}</p>}
      <button type="submit">Sign up</button>
    </form>
  );
}