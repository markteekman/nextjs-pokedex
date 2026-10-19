/** Formats a Pokédex ID with a # prefix and at least four digits, e.g. 1 → "#0001" */
export default function formatDexNumber(id: number) {
  return `#${id.toString().padStart(4, "0")}`;
}
