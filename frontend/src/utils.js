export function ratingText(story) {
  return story.average_rating
    ? `★ ${story.average_rating} (${story.rating_count} ratings)`
    : "No ratings yet";
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString();
}