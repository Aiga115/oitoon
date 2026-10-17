// Five clickable stars. Filled up to the current value.
export default function RatingStars({ value, onRate }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" className="star" aria-label={`Rate ${n}`} onClick={() => onRate(n)}>
          {n <= (value || 0) ? "★" : "☆"}
        </button>
      ))}
    </span>
  );
}