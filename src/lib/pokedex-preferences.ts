export type PokedexPreferences = {
  reduceMotion: boolean;
  autoplayCry: boolean;
  enhanceContrast: boolean;
};

export const DEFAULT_PREFERENCES: PokedexPreferences = {
  reduceMotion: false,
  autoplayCry: true,
  enhanceContrast: false,
};

/** Ignore malformed storage and unknown fields rather than trusting saved JSON. */
export function parsePreferences(value: string | null): PokedexPreferences {
  try {
    const saved: unknown = value ? JSON.parse(value) : null;
    if (!saved || typeof saved !== "object") return DEFAULT_PREFERENCES;
    const preferences = saved as Record<string, unknown>;
    return {
      reduceMotion:
        typeof preferences.reduceMotion === "boolean"
          ? preferences.reduceMotion
          : DEFAULT_PREFERENCES.reduceMotion,
      autoplayCry:
        typeof preferences.autoplayCry === "boolean"
          ? preferences.autoplayCry
          : DEFAULT_PREFERENCES.autoplayCry,
      enhanceContrast:
        typeof preferences.enhanceContrast === "boolean"
          ? preferences.enhanceContrast
          : DEFAULT_PREFERENCES.enhanceContrast,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}
