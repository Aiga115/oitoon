import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WritePage from "./pages/WritePage";
import Placeholder from "./pages/Placeholder";
import StoryPage from "./pages/StoryPage";
import AuthorPage from "./pages/AuthorPage";
import EditPage from "./pages/EditPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminUserPage from "./pages/AdminUserPage";
import AdminStoriesPage from "./pages/AdminStoriesPage";
import AdminStoryEditPage from "./pages/AdminStoryEditPage";
import Footer from "./components/Footer";

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

          <Route
            path="/write"
            element={
              <ProtectedRoute>
                <WritePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommended"
            element={
              <ProtectedRoute>
                <Placeholder title="Recommended for you (Sprint 6)" />
              </ProtectedRoute>
            }
          />

          <Route path="/stories/:id" element={<StoryPage />} />
          <Route path="/authors/:username" element={<AuthorPage />} />
          <Route
            path="/stories/:id/edit"
            element={
              <ProtectedRoute>
                <EditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute role="admin">
                <AdminUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stories"
            element={
              <ProtectedRoute role="admin">
                <AdminStoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stories/:id"
            element={
              <ProtectedRoute role="admin">
                <AdminStoryEditPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
