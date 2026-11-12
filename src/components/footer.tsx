import { Copyright } from "lucide-react";

const badges = [
  {
    label: "Next.js",
    colorClasses: "bg-yellow-400/10 text-yellow-500 inset-ring-yellow-400/20",
  },
  {
    label: "TypeScript",
    colorClasses: "bg-green-400/10 text-green-400 inset-ring-green-500/20",
  },
  {
    label: "Tailwind",
    colorClasses: "bg-purple-400/10 text-purple-400 inset-ring-purple-400/30",
  },
  {
    label: "GraphQL",
    colorClasses: "bg-blue-400/10 text-blue-400 inset-ring-blue-400/30",
  },
  {
    label: "React ARIA",
    colorClasses: "bg-indigo-400/10 text-indigo-400 inset-ring-indigo-400/30",
  },
  {
    label: "Motion",
    colorClasses: "bg-pink-400/10 text-pink-400 inset-ring-pink-400/20",
  },
  {
    label: "GitHub",
    colorClasses: "bg-gray-400/10 text-gray-400 inset-ring-gray-400/20",
  },
  {
    label: "Netlify",
    colorClasses: "bg-red-400/10 text-red-400 inset-ring-red-400/20",
  },
];

export function Footer() {
  return (
    <footer className="py-20">
      <p className="mb-5 flex flex-wrap items-center justify-center gap-2 font-bold">
        <Copyright size={20} />
        {new Date().getFullYear()} Pokédex App - By{" "}
        <a
          href="https://markteekman.nl"
          className="underline decoration-2 underline-offset-4 hover:no-underline"
        >
          Mark Teekman
        </a>
        . Tech stack:
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {badges.map(({ label, colorClasses }) => (
          <span
            key={label}
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium inset-ring ${colorClasses}`}
          >
            {label}
          </span>
        ))}
      </div>
    </footer>
  );
}
