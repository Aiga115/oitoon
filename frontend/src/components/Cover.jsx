export default function Cover({ story, large = false }) {
  const size = large ? " cover-large" : "";

  if (story.cover) {
    return (
      <div className={"cover" + size}>
        <img src={story.cover} alt={large ? story.title : ""} />
      </div>
    );
  }

  return (
    <div className={"cover cover-placeholder" + size} aria-hidden="true">
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 14h18c3 0 6 2 6 6v30c0-3-3-5-6-5H8z" />
        <path d="M56 14H38c-3 0-6 2-6 6v30c0-3 3-5 6-5h18z" />
        <g transform="rotate(45 48 44)">
          <rect
            x="45"
            y="26"
            width="6"
            height="26"
            style={{ fill: "var(--ink)" }}
          />
          <path d="M45 52l3 6 3-6z" style={{ fill: "var(--ink)" }} />
        </g>
      </svg>
    </div>
  );
}
