export const POKEMON_MAX_ID = 649;

/** Accept only canonical detail paths within the supported catalog. */
export function parsePokemonId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;

  const id = Number(value);
  return id <= POKEMON_MAX_ID ? id : null;
}
