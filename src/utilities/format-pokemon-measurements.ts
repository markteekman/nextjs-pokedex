/** Formats a height supplied in decimetres as metres */
export function formatPokemonHeight(height: number) {
  return `${(height / 10).toFixed(1)} m`;
}

/** Formats a weight supplied in hectograms as kilograms */
export function formatPokemonWeight(weight: number) {
  return `${(weight / 10).toFixed(1)} kg`;
}
