import { Link } from "react-router-dom";
import { formatDate, ratingText } from "../utils";

export default function StoryTile({ story }) {
  return (
    <div className="tile">
      <span className="no">Story: {String(story.id).padStart(3, "0")}</span>
      <h3><Link to={`/stories/${story.id}`}>{story.title}</Link></h3>
      <span className="meta">
        by <Link to={`/authors/${story.author_username}`}>{story.author_username}</Link> · {formatDate(story.created_at)}
      </span>
      <p className="excerpt">{story.excerpt}</p>
      <span className="meta">{ratingText(story)}</span>
    </div>
  );
}