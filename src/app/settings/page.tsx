"use client";

import { Switch } from "react-aria-components";
import {
  updatePreferences,
  usePokedexPreferences,
} from "@/hooks/use-pokedex-preferences";

type Setting = {
  key: string;
  label: string;
  isSelected: boolean;
  isDisabled: boolean;
  onChange?: (value: boolean) => void;
  description: string;
};

export default function Settings() {
  const {
    ready,
    reduceMotion,
    autoplayCry,
    enhanceContrast,
    systemReduceMotion,
  } = usePokedexPreferences();
  const settings: Setting[] = [
    {
      key: "reduceMotion",
      label: "Reduce motion",
      isSelected: reduceMotion,
      isDisabled: !ready || systemReduceMotion,
      onChange: (value: boolean) => updatePreferences({ reduceMotion: value }),
      description: systemReduceMotion
        ? "Enabled by your device’s reduced-motion preference."
        : "Skip the Pokémon’s entrance bounce and animated cry visualizer.",
    },
    {
      key: "disableCryAutoplay",
      label: "Disable cry autoplay",
      isSelected: !autoplayCry,
      isDisabled: !ready,
      onChange: (value: boolean) => updatePreferences({ autoplayCry: !value }),
      description:
        "Stop cries from playing automatically when opening a Pokémon. You can still play them manually.",
    },
    {
      key: "enhanceContrast",
      label: "Enhance contrast",
      isSelected: enhanceContrast,
      isDisabled: !ready,
      onChange: (value: boolean) =>
        updatePreferences({ enhanceContrast: value }),
      description:
        "Use a clearer blue screen, stronger outlines, and sharper text.",
    },
  ];

  return (
    <div
      className="pokemon-settings flex h-full min-h-0 flex-col"
      data-reduce-motion={reduceMotion || undefined}
    >
      <div className="pokedex-index-header shrink-0">
        <h1 className="text-xl">Settings</h1>
      </div>
      <p className="pokemon-settings-intro">
        Adjust motion, sound, and contrast to suit you.
      </p>
      <ul className="pokemon-settings-list">
        {settings.map((setting) => (
          <li key={setting.key} className="pokemon-setting">
            <Switch
              name={setting.key}
              value="true"
              isSelected={setting.isSelected}
              isDisabled={setting.isDisabled}
              onChange={setting.onChange}
              aria-describedby={`${setting.key}-description`}
              className="pokemon-setting-switch"
            >
              <span className="pokemon-setting-label">{setting.label}</span>
              <span className="pokemon-setting-track" aria-hidden="true">
                <span className="pokemon-setting-thumb" />
              </span>
            </Switch>
            <p
              id={`${setting.key}-description`}
              className="pokemon-setting-description"
            >
              {setting.description}
            </p>
          </li>
        ))}
      </ul>
      <p className="pokemon-settings-note">Changes apply immediately.</p>
    </div>
  );
}
