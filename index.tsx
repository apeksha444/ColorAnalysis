import { createFileRoute } from "@tanstack/react-router";
import { ColorAnalysis } from "@/components/ColorAnalysis";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Hue Map — Personal Color Analysis" },
      {
        name: "description",
        content:
          "Answer three quick questions about undertone, contrast, and depth to discover your personal color palette.",
      },
    ],
  }),
});

function Index() {
  return <ColorAnalysis />;
}
