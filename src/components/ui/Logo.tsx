import { Link } from "react-router-dom";

interface LogoProps {
  showVersion?: boolean;
  className?: string;
}

export default function Logo({
  showVersion = false,
  className = "",
}: LogoProps) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-3 group ${className}`}
      aria-label="HAVN Home"
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 shadow-lg shadow-orange-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-orange-500/40">
        <svg
          className="h-5 w-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2L4 14h6l-1 8 11-14h-6l1-6z" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            HAVN
          </span>

          {showVersion && (
            <span className="rounded-md border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange-300">
              v1.0
            </span>
          )}
        </div>

        <span className="text-xs tracking-wide text-zinc-400">
          From Code to Cloud
        </span>
      </div>
    </Link>
  );
}