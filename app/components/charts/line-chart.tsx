type LineChartPoint = {
  label: string;
  value: number;
};

type LineChartProps = {
  data: LineChartPoint[];
  title?: string;
  maxValue?: number;
  className?: string;
};

export function LineChart({ data, title = "Quantity (Units)", maxValue, className }: LineChartProps) {
  const width = 720;
  const height = 270;
  const padding = { top: 32, right: 20, bottom: 40, left: 54 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  const stepX = data.length > 1 ? chartWidth / (data.length - 1) : 0;

  const points = data.map((d, index) => ({
    x: padding.left + index * stepX,
    y: padding.top + chartHeight - (d.value / max) * chartHeight,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? padding.left} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

  const gridY = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    y: padding.top + chartHeight * (1 - ratio),
    label: Math.round(max * ratio).toLocaleString(),
  }));

  return (
    <div className={`h-[210px] sm:h-[250px] lg:h-[270px] ${className ?? ""}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2f6df6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2f6df6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridY.map((line) => (
          <line
            key={line.y}
            x1={padding.left}
            x2={width - padding.right}
            y1={line.y}
            y2={line.y}
            stroke="#e8edf5"
          />
        ))}

        <text x="0" y="26" fill="#64748b" fontSize="12" fontWeight="600">
          {title}
        </text>
        {gridY.map((line) => (
          <text key={`label-${line.y}`} x="26" y={line.y + 4} fill="#64748b" fontSize="12">
            {line.label}
          </text>
        ))}

        <path d={areaPath} fill="url(#lineFill)" />
        <path d={linePath} fill="none" stroke="#2f6df6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, index) => (
          <g key={index}>
            <circle cx={p.x} cy={p.y} r="5" fill="#2f6df6" stroke="#fff" strokeWidth="2" />
            <text x={p.x} y={height - 12} textAnchor="middle" fill="#64748b" fontSize="12">
              {data[index]?.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
