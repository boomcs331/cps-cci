export function FactoryIllustration() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-slate-50/40 to-blue-200/40" />

      {/* Abstract factory scene */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-[55%] w-full"
        viewBox="0 0 800 360"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="factoryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="smokeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Ground hills */}
        <path
          d="M0 360 L0 260 Q150 220 300 260 T600 240 T800 280 L800 360 Z"
          fill="url(#factoryGradient)"
        />

        {/* Factory buildings */}
        <g fill="#60a5fa" opacity="0.35">
          <rect x="80" y="170" width="90" height="140" rx="4" />
          <rect x="190" y="140" width="110" height="170" rx="4" />
          <rect x="330" y="190" width="70" height="120" rx="4" />
          <rect x="430" y="150" width="130" height="160" rx="4" />
          <rect x="600" y="180" width="100" height="130" rx="4" />
        </g>

        {/* Smokestacks */}
        <g fill="#3b82f6" opacity="0.4">
          <rect x="210" y="70" width="22" height="70" />
          <rect x="250" y="50" width="26" height="90" />
          <rect x="470" y="80" width="24" height="70" />
          <rect x="640" y="100" width="20" height="80" />
        </g>

        {/* Smoke clouds */}
        <g fill="url(#smokeGradient)">
          <circle cx="200" cy="55" r="18" />
          <circle cx="225" cy="45" r="24" />
          <circle cx="255" cy="55" r="20" />
          <circle cx="470" cy="60" r="16" />
          <circle cx="495" cy="50" r="22" />
          <circle cx="640" cy="75" r="15" />
          <circle cx="660" cy="65" r="20" />
        </g>

        {/* Robotic arm */}
        <g stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" opacity="0.5" fill="none">
          <path d="M120 360 L120 280 L180 240" />
          <path d="M180 240 L230 260" />
          <circle cx="120" cy="280" r="8" fill="#2563eb" stroke="none" />
          <circle cx="180" cy="240" r="6" fill="#2563eb" stroke="none" />
        </g>
        <g fill="#2563eb" opacity="0.6">
          <rect x="210" y="255" width="30" height="12" rx="4" />
          <rect x="225" y="250" width="10" height="22" rx="2" />
        </g>

        {/* Conveyor / boxes */}
        <g fill="#93c5fd" opacity="0.5">
          <rect x="500" y="290" width="40" height="30" rx="3" />
          <rect x="550" y="280" width="35" height="35" rx="3" />
          <rect x="600" y="295" width="38" height="28" rx="3" />
        </g>

        {/* Decorative dots */}
        <g fill="#3b82f6" opacity="0.15">
          <circle cx="50" cy="80" r="4" />
          <circle cx="80" cy="120" r="3" />
          <circle cx="120" cy="60" r="5" />
          <circle cx="700" cy="90" r="4" />
          <circle cx="740" cy="130" r="3" />
        </g>
      </svg>
    </div>
  );
}
