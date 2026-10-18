import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, admin, logoutUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      {user && <Link to="/write">Write</Link>}
      {user && <Link to="/recommended">Recommended</Link>}
      {admin && <Link to="/admin/users">Users</Link>}
      {admin && <Link to="/admin/stories">Stories</Link>}
      <span className="spacer" />
      {user && <span>{user}</span>}
      {user && (
        <button onClick={() => { logoutUser(); navigate("/"); }}>Log out</button>
      )}
      {admin && (
        <button onClick={() => { logoutAdmin(); navigate("/"); }}>Admin log out</button>
      )}
      {!user && !admin && (
        <>
          <Link to="/login">Log in</Link>
          <Link to="/register">Sign up</Link>
          <Link to="/admin/login">Admin</Link>
        </>
      )}
    </nav>
  );
}