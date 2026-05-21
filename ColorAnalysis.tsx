import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Undertone = "cool" | "warm" | "neutral";
type Contrast = "low" | "medium" | "high";
type Depth = "light" | "medium" | "deep";

type Answers = {
  undertone: Undertone | null;
  contrast: Contrast | null;
  depth: Depth | null;
};

type Option<T extends string> = {
  value: T;
  label: string;
  hint: string;
};

type Step = {
  key: keyof Answers;
  title: string;
  subtitle: string;
  options: Option<string>[];
};

const STEPS: Step[] = [
  {
    key: "undertone",
    title: "What's your undertone?",
    subtitle: "Look at the veins on the inside of your wrist in natural light.",
    options: [
      { value: "cool", label: "Cool", hint: "Veins look blue or purple. Silver flatters more than gold." },
      { value: "warm", label: "Warm", hint: "Veins look green. Gold jewelry warms your skin." },
      { value: "neutral", label: "Neutral", hint: "A mix of both — silver and gold both work." },
    ],
  },
  {
    key: "contrast",
    title: "How much contrast do you carry?",
    subtitle: "Compare your hair, eyes, and skin against each other.",
    options: [
      { value: "low", label: "Low", hint: "Hair, skin, and eyes sit in a similar tonal range." },
      { value: "medium", label: "Medium", hint: "Noticeable but soft difference between features." },
      { value: "high", label: "High", hint: "Sharp contrast — think dark hair with fair skin or vice versa." },
    ],
  },
  {
    key: "depth",
    title: "What's your overall depth?",
    subtitle: "The general lightness or darkness of your coloring.",
    options: [
      { value: "light", label: "Light", hint: "Fair skin, light hair, or pale eyes dominate." },
      { value: "medium", label: "Medium", hint: "Mid-tone across skin and hair." },
      { value: "deep", label: "Deep", hint: "Rich, dark coloring overall." },
    ],
  },
];

type Palette = {
  name: string;
  description: string;
  colors: { name: string; hex: string }[];
};

function buildPalette(a: Required<Answers>): Palette {
  // 12 seasonal-ish palettes keyed by undertone × depth, modulated by contrast.
  const key = `${a.undertone}-${a.depth}-${a.contrast}`;
  const map: Record<string, Palette> = {};

  const palettes: Record<string, Palette> = {
    "cool-light": {
      name: "Cool Light — Soft Summer Dawn",
      description: "Hushed, powdery cools that flatter without overwhelming.",
      colors: [
        { name: "Frost Lilac", hex: "#D8D4E8" },
        { name: "Mist Blue", hex: "#A7B8CC" },
        { name: "Sea Glass", hex: "#9CBFB7" },
        { name: "Petal Pink", hex: "#E8C8D2" },
        { name: "Slate Plum", hex: "#6B6376" },
      ],
    },
    "cool-medium": {
      name: "Cool Medium — True Summer",
      description: "Clean, jewel-cool tones with a gentle hand.",
      colors: [
        { name: "Sapphire", hex: "#3B5A8A" },
        { name: "Rose Quartz", hex: "#C97C8C" },
        { name: "Pewter", hex: "#7A8A95" },
        { name: "Iced Teal", hex: "#5B9AA0" },
        { name: "Wine", hex: "#7A2E40" },
      ],
    },
    "cool-deep": {
      name: "Cool Deep — Cool Winter",
      description: "Inky, glacial saturation with high impact.",
      colors: [
        { name: "Midnight", hex: "#1A2238" },
        { name: "Ice White", hex: "#F2F5FA" },
        { name: "Crimson", hex: "#9B1C3D" },
        { name: "Emerald", hex: "#0F5C46" },
        { name: "Royal Purple", hex: "#3D1A5B" },
      ],
    },
    "warm-light": {
      name: "Warm Light — Light Spring",
      description: "Sun-warmed pastels that glow on golden skin.",
      colors: [
        { name: "Peach Cream", hex: "#F5C7A0" },
        { name: "Buttercup", hex: "#F0D77B" },
        { name: "Coral Blush", hex: "#F1A48C" },
        { name: "Mint Sprout", hex: "#B6D7B0" },
        { name: "Aqua Sky", hex: "#7FC4D1" },
      ],
    },
    "warm-medium": {
      name: "Warm Medium — True Autumn",
      description: "Spiced, earthy warmth with depth and grain.",
      colors: [
        { name: "Burnt Sienna", hex: "#A0522D" },
        { name: "Mustard", hex: "#C9A227" },
        { name: "Olive", hex: "#6B7A3A" },
        { name: "Brick", hex: "#8B3A2F" },
        { name: "Forest", hex: "#3A5A40" },
      ],
    },
    "warm-deep": {
      name: "Warm Deep — Deep Autumn",
      description: "Smoldering, saturated warmth — fireside richness.",
      colors: [
        { name: "Mahogany", hex: "#4A1E1A" },
        { name: "Gold Leaf", hex: "#B8860B" },
        { name: "Cinnabar", hex: "#B23A1F" },
        { name: "Deep Teal", hex: "#1F4E4B" },
        { name: "Espresso", hex: "#2B1A12" },
      ],
    },
    "neutral-light": {
      name: "Neutral Light — Soft Spring",
      description: "Balanced, gently warmed neutrals with quiet color.",
      colors: [
        { name: "Oat Milk", hex: "#EFE6D8" },
        { name: "Dusty Rose", hex: "#D8A8A0" },
        { name: "Sage", hex: "#B5C2A8" },
        { name: "Camel", hex: "#C9A87C" },
        { name: "Soft Denim", hex: "#7E96AF" },
      ],
    },
    "neutral-medium": {
      name: "Neutral Medium — Soft Autumn",
      description: "Muted, mid-tone palette that bridges warm and cool.",
      colors: [
        { name: "Terracotta", hex: "#B86B4B" },
        { name: "Moss", hex: "#6F7A4F" },
        { name: "Smoke Blue", hex: "#5C7A8A" },
        { name: "Mauve", hex: "#9B6F7C" },
        { name: "Driftwood", hex: "#7A6A56" },
      ],
    },
    "neutral-deep": {
      name: "Neutral Deep — Deep Winter",
      description: "Rich, balanced darks with one electric accent.",
      colors: [
        { name: "Obsidian", hex: "#15181E" },
        { name: "Bone", hex: "#E8E3D8" },
        { name: "Bordeaux", hex: "#5A1A2B" },
        { name: "Pine", hex: "#1C3A2E" },
        { name: "Electric Magenta", hex: "#B4257A" },
      ],
    },
  };

  // Build keys for all contrasts pointing to the base palette,
  // then nudge based on contrast level by swapping the accent.
  const base = palettes[`${a.undertone}-${a.depth}`];
  if (!base) {
    return palettes["neutral-medium"];
  }

  if (a.contrast === "high") {
    return {
      ...base,
      description: base.description + " Lean into your contrast with bold pairings.",
    };
  }
  if (a.contrast === "low") {
    return {
      ...base,
      description: base.description + " Keep combinations tonal — avoid stark light/dark splits.",
    };
  }
  return base;
}

export function ColorAnalysis() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    undertone: null,
    contrast: null,
    depth: null,
  });
  const [done, setDone] = useState(false);

  const step = STEPS[stepIndex];
  const palette = useMemo(() => {
    if (!done || !answers.undertone || !answers.contrast || !answers.depth) return null;
    return buildPalette(answers as Required<Answers>);
  }, [done, answers]);

  function choose(value: string) {
    const next = { ...answers, [step.key]: value } as Answers;
    setAnswers(next);
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setAnswers({ undertone: null, contrast: null, depth: null });
    setStepIndex(0);
    setDone(false);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Personal Color Study
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-tight tracking-tight text-foreground sm:text-6xl">
            Hue Map
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            Three quiet questions. One palette built for the colors you already are.
          </p>
        </header>

        {!palette ? (
          <section className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
            <div className="mb-8 flex items-center gap-3">
              {STEPS.map((s, i) => (
                <div
                  key={s.key}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i <= stepIndex ? "bg-primary" : "bg-muted",
                  )}
                />
              ))}
            </div>

            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">
              {step.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{step.subtitle}</p>

            <div className="mt-8 grid gap-3">
              {step.options.map((opt) => {
                const selected = answers[step.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => choose(opt.value)}
                    className={cn(
                      "group rounded-2xl border border-border bg-background px-5 py-4 text-left transition-all",
                      "hover:border-primary hover:bg-accent/30",
                      selected && "border-primary bg-accent/40",
                    )}
                  >
                    <div className="font-serif text-lg text-foreground">{opt.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{opt.hint}</div>
                  </button>
                );
              })}
            </div>

            {stepIndex > 0 && (
              <button
                onClick={() => setStepIndex(stepIndex - 1)}
                className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
              >
                ← Back
              </button>
            )}
          </section>
        ) : (
          <section className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Your palette
            </p>
            <h2 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">
              {palette.name}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              {palette.description}
            </p>

            <div className="mt-8 grid grid-cols-5 overflow-hidden rounded-2xl border border-border">
              {palette.colors.map((c) => (
                <div key={c.hex} className="aspect-[2/3]" style={{ backgroundColor: c.hex }} />
              ))}
            </div>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {palette.colors.map((c) => (
                <li
                  key={c.hex}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2"
                >
                  <span
                    className="h-6 w-6 rounded-md border border-border"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="flex-1 text-sm text-foreground">{c.name}</span>
                  <span className="font-mono text-xs uppercase text-muted-foreground">
                    {c.hex}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={restart} className="rounded-full px-6">
                Start over
              </Button>
              <div className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {answers.undertone} · {answers.contrast} contrast · {answers.depth}
              </div>
            </div>
          </section>
        )}

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Best viewed in soft, natural light.
        </footer>
      </div>
    </main>
  );
}
