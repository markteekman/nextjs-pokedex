"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = {
  src: string;
  name?: string;
};

type AudioGraph = { context: AudioContext; analyser: AnalyserNode };
const BAR_COUNT = 24;

export default function PokeCry({ src, name = "Pokémon" }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);
  const graphRef = useRef<AudioGraph | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "playing" | "paused" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const isPlaying = status === "playing";

  useEffect(() => {
    if (
      !isPlaying ||
      !graphRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const { analyser } = graphRef.current;
    const frequencies = new Uint8Array(analyser.frequencyBinCount);
    const bars = meterRef.current?.children;
    let frame: number;

    function updateMeter() {
      analyser.getByteFrequencyData(frequencies);
      if (bars) {
        Array.from(bars).forEach((bar, index) => {
          const level = (frequencies[index + 1] ?? 0) / 255;
          (bar as HTMLElement).style.scale = `1 ${Math.max(0.08, level)}`;
        });
      }
      frame = requestAnimationFrame(updateMeter);
    }

    updateMeter();
    return () => {
      cancelAnimationFrame(frame);
      if (bars)
        Array.from(bars).forEach((bar) => {
          (bar as HTMLElement).style.scale = "1 0.08";
        });
    };
  }, [isPlaying]);

  useEffect(
    () => () => {
      void graphRef.current?.context.close();
    },
    [],
  );

  async function togglePlayback() {
    if (status === "loading") return;
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    setStatus("loading");

    try {
      // Create one graph per element, from a playback gesture. Without Web Audio,
      // playback still works and the meter remains a quiet baseline.
      if (!graphRef.current && typeof AudioContext !== "undefined") {
        const context = new AudioContext();
        const analyser = context.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.7;
        context.createMediaElementSource(audio).connect(analyser);
        analyser.connect(context.destination);
        graphRef.current = { context, analyser };
      }
      await graphRef.current?.context.resume();
      if (audio.error) audio.load();
      if (audio.ended) audio.currentTime = 0;
      await audio.play();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="pokecry" data-playing={isPlaying}>
      <audio
        ref={audioRef}
        className="pokecry-native"
        controls
        crossOrigin="anonymous"
        preload="none"
        aria-label={`${name} cry`}
        src={src}
        onPlaying={() => setStatus("playing")}
        onPause={() => setStatus("paused")}
        onWaiting={() => setStatus("loading")}
        onEnded={() => {
          setStatus("idle");
          setProgress(0);
        }}
        onError={() => setStatus("error")}
        onTimeUpdate={(event) => {
          const { currentTime, duration } = event.currentTarget;
          setProgress(
            Number.isFinite(duration) && duration > 0
              ? currentTime / duration
              : 0,
          );
        }}
      />
      <button
        type="button"
        className="pokecry-button"
        onClick={togglePlayback}
        aria-disabled={status === "loading"}
        aria-busy={status === "loading"}
      >
        <span className="pokecry-play-icon" aria-hidden="true">
          {isPlaying ? (
            <Pause size={16} fill="currentColor" />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
        </span>
        <span className="pokecry-label">
          {status === "loading"
            ? "Loading…"
            : isPlaying
              ? "Pause cry"
              : "Play cry"}
        </span>
        <span className="sr-only"> for {name}</span>
        <span className="pokecry-meter" ref={meterRef} aria-hidden="true">
          {Array.from({ length: BAR_COUNT }, (_, index) => (
            <span key={index} />
          ))}
        </span>
        <span
          className="pokecry-progress"
          style={{ "--cry-progress": progress } as CSSProperties}
          aria-hidden="true"
        />
      </button>
      <p className="pokecry-error" role="status">
        {status === "error" && "Cry unavailable. Try playing it again."}
      </p>
    </div>
  );
}
