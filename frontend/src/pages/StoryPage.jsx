import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "react-quill-new/dist/quill.snow.css"; // needed so the bigger/smaller sizes display
import api, { errorText } from "../api";
import { useAuth } from "../AuthContext";
import RatingStars from "../components/RatingStars";
import { formatDate, ratingText } from "../utils";
import Cover from "../components/Cover";

export default function StoryPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/stories/${id}/`)
      .then((res) => setStory(res.data))
      .catch(() => setError("Story not found."));
  }, [id]);

  async function rate(value) {
    try {
      const res = await api.put(`/stories/${id}/rating/`, { value });
      setStory(res.data); // the backend returns the story with the new average
    } catch (err) {
      setError(errorText(err));
    }
  }

  async function removeRating() {
    try {
      await api.delete(`/stories/${id}/rating/`);
      const res = await api.get(`/stories/${id}/`); // reload to get the new average
      setStory(res.data);
    } catch (err) {
      setError(errorText(err));
    }
  }

  async function deleteStory() {
    if (!window.confirm("Delete this story?")) return;
    try {
      await api.delete(`/stories/${id}/`);
      navigate("/");
    } catch (err) {
      setError(errorText(err));
    }
  }

  if (!story)
    return error ? <p className="error">{error}</p> : <p>Loading...</p>;

  const isOwner = user === story.author_username;

  return (
    <div>
      <h1>{story.title}</h1>
      {!story.is_published && (
        <p className="error">
          This story is unpublished. Only you and the admins can see it.
        </p>
      )}

      <div className="detail">
        <div className="detail-cover">
          <Cover story={story} large />
        </div>

        <div className="detail-side">
          <span>Story: {String(story.id).padStart(3, "0")}</span>
          <span>
            By{" "}
            <Link to={`/authors/${story.author_username}`}>
              {story.author_username}
            </Link>
          </span>
          <span>{formatDate(story.created_at)}</span>
          <span>{ratingText(story)}</span>
          {error && <span className="error">{error}</span>}

          {!user && (
            <span>
              <Link to="/login">Log in</Link> to rate this story.
            </span>
          )}
          {user && isOwner && (
            <>
              <span>You cannot rate your own story.</span>
              <Link className="button" to={`/stories/${id}/edit`}>
                Edit
              </Link>
              <button className="secondary" onClick={deleteStory}>
                Delete
              </button>
            </>
          )}
          {user && !isOwner && (
            <>
              <span>Your rating</span>
              <RatingStars value={story.my_rating} onRate={rate} />
              {story.my_rating && (
                <button className="secondary" onClick={removeRating}>
                  Remove rating
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="story-text">
        {/* The backend sanitised this HTML with nh3 before saving, so it is safe to display. */}
        <div className="ql-snow story-body">
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
        </div>
      </div>
    </div>
  );
}
