import { Link } from "react-router-dom";
import { formatDate, ratingText } from "../utils";
import Cover from "./Cover";

export default function StoryTile({ story }) {
  return (
    <div className="tile">
      <Cover story={story} />
      <span className="no">Story: {String(story.id).padStart(3, "0")}</span>
      <h3>
        <Link to={`/stories/${story.id}`}>{story.title}</Link>
      </h3>
      <span className="meta">
        {story.status_label}
        {story.genre_names.length > 0 && " · " + story.genre_names.join(", ")}
        {!story.is_published && " · hidden by admin"}
      </span>
      <span className="meta">{ratingText(story)}</span>
      <p className="excerpt">{story.excerpt}</p>
      <span className="meta">{ratingText(story)}</span>
    </div>
  );
}
