import { cn } from "@/lib/utils";

export const HeroBackground = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      {/* Radial gradient: deep navy → vibrant blue (matches --primary #2563EB) */}
      <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_10%,#0F172A_40%,#2563EB_100%)]" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glowing orb — top center */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />

      {/* Accent orb — bottom right */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[100px] pointer-events-none" />
    </div>
  );
};
