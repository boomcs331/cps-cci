export function ProductionLine() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f4c81] via-[#0d3f6d] to-[#0f172a]" />

      {/* Subtle grid pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Production line SVG */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-[60%] w-full"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Factory skyline */}
        <g opacity="0.15" fill="#f8fafc">
          <rect x="50" y="220" width="80" height="180" />
          <rect x="150" y="180" width="100" height="220" />
          <rect x="280" y="240" width="60" height="160" />
          <rect x="380" y="200" width="120" height="200" />
          <rect x="540" y="250" width="90" height="150" />
          <rect x="670" y="210" width="80" height="190" />
        </g>

        {/* Smokestacks */}
        <g opacity="0.2" fill="#f8fafc">
          <rect x="170" y="120" width="20" height="60" />
          <rect x="210" y="100" width="24" height="80" />
          <rect x="420" y="130" width="22" height="70" />
          <rect x="570" y="140" width="18" height="110" />
        </g>

        {/* Production line path */}
        <path
          d="M-50 320 Q100 320 150 280 T300 280 T450 300 T600 260 T850 260"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Moving nodes */}
        <circle r="6" fill="#f59e0b" opacity="0.9">
          <animateMotion
            dur="8s"
            repeatCount="indefinite"
            path="M-50 320 Q100 320 150 280 T300 280 T450 300 T600 260 T850 260"
          />
        </circle>
        <circle r="5" fill="#f59e0b" opacity="0.7">
          <animateMotion
            dur="8s"
            begin="2.6s"
            repeatCount="indefinite"
            path="M-50 320 Q100 320 150 280 T300 280 T450 300 T600 260 T850 260"
          />
        </circle>
        <circle r="4" fill="#f59e0b" opacity="0.5">
          <animateMotion
            dur="8s"
            begin="5.3s"
            repeatCount="indefinite"
            path="M-50 320 Q100 320 150 280 T300 280 T450 300 T600 260 T850 260"
          />
        </circle>

        {/* Kanban stations */}
        <g fill="#f8fafc" opacity="0.3">
          <rect x="120" y="265" width="60" height="40" rx="4" />
          <rect x="270" y="245" width="60" height="40" rx="4" />
          <rect x="420" y="265" width="60" height="40" rx="4" />
          <rect x="570" y="225" width="60" height="40" rx="4" />
        </g>
      </svg>
    </div>
  );
}
