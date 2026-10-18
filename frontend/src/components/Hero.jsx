export default function Hero({ title, subtitle }) {
  return (
    <div className="hero">
      <h1>{title}</h1>
      <p className="tagline">{subtitle}</p>
    </div>
  );
}