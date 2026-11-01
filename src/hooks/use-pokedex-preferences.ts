"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  parsePreferences,
  type PokedexPreferences,
} from "@/lib/pokedex-preferences";

const STORAGE_KEY = "pokedex:preferences";
const CHANGE_EVENT = "pokedex-preferences-change";
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
let memorySnapshot = "{}";
let storageUnavailable = false;

function getSnapshot(): string {
  if (!storageUnavailable) {
    try {
      return window.localStorage.getItem(STORAGE_KEY) ?? "{}";
    } catch {
      storageUnavailable = true;
    }
  }
  return memorySnapshot;
}

function getServerSnapshot(): null {
  return null;
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

function subscribeToMotion(callback: () => void) {
  const media = window.matchMedia(MOTION_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getSystemMotionPreference() {
  return window.matchMedia(MOTION_QUERY).matches;
}

function getServerMotionPreference() {
  // Render without motion until browser preferences have been read.
  return true;
}

export function updatePreferences(update: Partial<PokedexPreferences>) {
  memorySnapshot = JSON.stringify({
    ...parsePreferences(getSnapshot()),
    ...update,
  });
  try {
    window.localStorage.setItem(STORAGE_KEY, memorySnapshot);
  } catch {
    // The controls still work for this session when storage is restricted.
    storageUnavailable = true;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function usePokedexPreferences() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const preferences = useMemo(() => parsePreferences(snapshot), [snapshot]);
  const systemReduceMotion = useSyncExternalStore(
    subscribeToMotion,
    getSystemMotionPreference,
    getServerMotionPreference,
  );

  return {
    ready: snapshot !== null,
    reduceMotion: preferences.reduceMotion || systemReduceMotion,
    autoplayCry: preferences.autoplayCry,
    systemReduceMotion,
  };
}
