"use client";

import { Switch } from "react-aria-components";
import {
  updatePreferences,
  usePokedexPreferences,
} from "@/hooks/use-pokedex-preferences";

type Setting = {
  key: string;
  label: string;
  defaultSelected?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  onChange?: (value: boolean) => void;
  description?: string;
};

export default function Settings() {
  const { ready, reduceMotion, autoplayCry, systemReduceMotion } =
    usePokedexPreferences();
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
      defaultSelected: false,
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-5xl">Settings</h1>
      <ul className="flex flex-col gap-3 text-3xl">
        {settings.map((setting) => (
          <li key={setting.key}>
            <Switch
              name={setting.key}
              value="true"
              defaultSelected={setting.defaultSelected}
              isSelected={setting.isSelected}
              isDisabled={setting.isDisabled}
              onChange={setting.onChange}
              aria-describedby={
                setting.description ? `${setting.key}-description` : undefined
              }
              className="group inline-flex min-h-11 items-center gap-3 rounded-sm text-black data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-4"
            >
              <span className="flex h-7 w-12 shrink-0 items-center rounded-full border-2 border-black bg-black/25 p-0.5 transition-colors group-data-[disabled]:opacity-50 group-data-[selected]:bg-green-500">
                <span className="h-5 w-5 rounded-full bg-white transition-transform group-data-[pressed]:scale-95 group-data-[selected]:translate-x-5" />
              </span>
              <span>{setting.label}</span>
            </Switch>
            {setting.description && (
              <p id={`${setting.key}-description`} className="mt-1 text-sm">
                {setting.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
