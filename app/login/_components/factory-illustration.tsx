export function FactoryIllustration() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="animate-gradient-shift absolute inset-0 bg-gradient-to-br from-blue-100/60 via-white/40 to-blue-200/40" />

      <svg
        className="absolute right-16 top-20 h-32 w-44 opacity-70"
        viewBox="0 0 176 128"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#ffffff" opacity="0.9">
          {Array.from({ length: 42 }).map((_, index) => (
            <circle
              key={index}
              cx={(index % 7) * 18 + 10}
              cy={Math.floor(index / 7) * 18 + 10}
              r="2.5"
            />
          ))}
        </g>
      </svg>

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-120 620 C40 560 150 610 255 690 C392 796 505 792 646 705 C736 650 812 642 920 690"
          fill="none"
          stroke="#bfdbfe"
          strokeWidth="148"
          strokeLinecap="round"
          opacity="0.28"
        />
        <path
          d="M430 790 C505 680 530 598 650 530 C737 482 780 414 824 340"
          fill="none"
          stroke="#dbeafe"
          strokeWidth="104"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>

      <svg
        className="absolute bottom-20 left-0 right-0 h-[42%] w-full opacity-85"
        viewBox="0 0 860 380"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="softBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.46" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id="glassBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id="smokeFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <path
          d="M0 318 C96 300 165 304 246 317 C342 334 442 326 548 307 C660 286 748 292 860 315 L860 380 L0 380 Z"
          fill="#dbeafe"
          opacity="0.42"
        />

        <g className="animate-factory-breathe" fill="url(#softBlue)">
          <rect x="498" y="170" width="78" height="142" rx="4" />
          <path d="M576 210 L662 168 L662 312 H576 Z" />
          <path d="M662 198 L744 158 L744 312 H662 Z" />
          <rect x="710" y="110" width="19" height="202" rx="2" />
          <rect x="734" y="96" width="15" height="216" rx="2" />
          <rect x="386" y="210" width="72" height="102" rx="4" />
          <rect x="405" y="180" width="9" height="35" rx="2" />
          <rect x="430" y="174" width="10" height="42" rx="2" />
          <rect x="774" y="224" width="56" height="88" rx="4" />
        </g>

        <g fill="#ffffff" opacity="0.34">
          <rect x="600" y="248" width="18" height="22" rx="2" />
          <rect x="631" y="248" width="18" height="22" rx="2" />
          <rect x="690" y="238" width="18" height="22" rx="2" />
          <rect x="720" y="238" width="18" height="22" rx="2" />
          <rect x="409" y="238" width="14" height="20" rx="2" />
          <rect x="432" y="238" width="14" height="20" rx="2" />
        </g>

        <g className="animate-stack-smoke">
          <circle cx="626" cy="128" r="25" fill="url(#smokeFade)" />
          <circle cx="658" cy="112" r="31" fill="url(#smokeFade)" />
          <circle cx="696" cy="96" r="37" fill="url(#smokeFade)" />
          <circle cx="740" cy="78" r="44" fill="url(#smokeFade)" />
        </g>

        <g className="animate-truck-drift">
          <rect x="468" y="268" width="132" height="42" rx="4" fill="#3b82f6" opacity="0.36" />
          <path d="M600 280 H645 L672 300 V310 H600 Z" fill="#60a5fa" opacity="0.36" />
          <rect x="617" y="287" width="25" height="14" rx="2" fill="#eff6ff" opacity="0.58" />
          <circle cx="500" cy="314" r="9" fill="#2563eb" opacity="0.36" />
          <circle cx="638" cy="314" r="9" fill="#2563eb" opacity="0.36" />
        </g>

        <g className="animate-package-flow" fill="url(#glassBlue)">
          <rect x="105" y="272" width="38" height="36" rx="3" />
          <rect x="174" y="260" width="50" height="48" rx="4" />
          <rect x="250" y="279" width="38" height="29" rx="3" />
          <rect x="332" y="266" width="56" height="42" rx="4" />
        </g>

        <g className="animate-reference-robot">
          <ellipse cx="222" cy="316" rx="58" ry="12" fill="#2563eb" opacity="0.15" />
          <rect x="203" y="266" width="48" height="44" rx="7" fill="#60a5fa" opacity="0.46" />
          <rect x="216" y="224" width="19" height="48" rx="6" fill="#60a5fa" opacity="0.48" />
          <g stroke="#3b82f6" strokeLinecap="round" fill="none" opacity="0.48">
            <path d="M226 224 L290 170" strokeWidth="13" />
            <path d="M290 170 L360 214" strokeWidth="13" />
            <path d="M360 214 L334 272" strokeWidth="11" />
          </g>
          <g fill="#93c5fd" stroke="#3b82f6" strokeWidth="6" opacity="0.58">
            <circle cx="226" cy="224" r="15" />
            <circle cx="290" cy="170" r="17" />
            <circle cx="360" cy="214" r="18" />
          </g>
          <g stroke="#3b82f6" strokeLinecap="round" fill="none" opacity="0.5">
            <path d="M334 272 C320 278 312 288 312 302" strokeWidth="7" />
            <path d="M334 272 C350 280 356 291 354 305" strokeWidth="7" />
          </g>
        </g>

        <g className="animate-mini-robot" opacity="0.5">
          <rect x="406" y="288" width="30" height="20" rx="5" fill="#60a5fa" />
          <circle cx="414" cy="313" r="7" fill="#3b82f6" />
          <circle cx="435" cy="313" r="7" fill="#3b82f6" />
          <path d="M436 288 C458 265 484 275 486 302" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>

        <path
          d="M42 314 H823"
          stroke="#60a5fa"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.22"
        />
      </svg>

      <svg
        className="absolute bottom-0 left-0 h-44 w-full"
        viewBox="0 0 900 180"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 74 C90 18 187 38 282 98 C405 176 510 170 624 110 C725 56 810 64 900 110 L900 180 L0 180 Z"
          fill="#bfdbfe"
          opacity="0.42"
        />
        <path
          d="M0 112 C125 46 236 70 350 126 C474 186 585 155 700 102 C788 62 850 74 900 96 L900 180 L0 180 Z"
          fill="#dbeafe"
          opacity="0.58"
        />
      </svg>
    </div>
  );
}
