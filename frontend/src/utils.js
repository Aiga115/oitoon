export function ratingText(story) {
  return story.average_rating
    ? `★ ${story.average_rating} (${story.rating_count} ratings)`
    : "No ratings yet";
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString();
}

export function storyFormData(title, content, cover, removeCover = false, extra = {}) {
  const data = new FormData();
  data.append("title", title);
  data.append("content", content);
  if (cover) data.append("cover", cover);             // a new file was chosen
  else if (removeCover) data.append("cover", "");     // an empty value tells the backend to remove it
  Object.entries(extra).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((v) => data.append(key, v));   // repeated key: genres
    else data.append(key, value);
  });
  return data;
}