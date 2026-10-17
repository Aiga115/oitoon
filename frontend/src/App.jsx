import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WritePage from "./pages/WritePage";
import Placeholder from "./pages/Placeholder";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<LoginPage isAdmin />} />

          <Route path="/write" element={<ProtectedRoute><WritePage /></ProtectedRoute>} />
          <Route path="/recommended" element={<ProtectedRoute><Placeholder title="Recommended for you (Sprint 6)" /></ProtectedRoute>} />

          <Route path="/admin/users" element={<ProtectedRoute role="admin"><Placeholder title="Admin: users (Sprint 5)" /></ProtectedRoute>} />
          <Route path="/admin/stories" element={<ProtectedRoute role="admin"><Placeholder title="Admin: stories (Sprint 5)" /></ProtectedRoute>} />

          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}