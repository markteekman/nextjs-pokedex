export default function formatDexNumber(id: number) {
  return `#${id.toString().padStart(4, "0")}`;
}
