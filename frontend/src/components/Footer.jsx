import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="footer">
      <div className="big">
        <Link to="/">Stories</Link>
        {user ? (
          <>
            <Link to="/write">Write</Link>
            <Link to="/recommended">Recommended</Link>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </>
        )}
      </div>
      <div className="bottom">
        <span>Oitoon</span>
        <span>©2026</span>
      </div>
    </footer>
  );
}
