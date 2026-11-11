export function ScreenLoader({
  message = "Loading Pokédex…",
}: {
  message?: string;
}) {
  return (
    <div className="pokedex-loading">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h7m6 0h7" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <p role="status">{message}</p>
    </div>
  );
}
