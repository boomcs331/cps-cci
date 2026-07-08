type DonutSegment = {
  value: number;
  color: string;
  label: string;
};

type DonutChartProps = {
  data: DonutSegment[];
  centerValue: string;
  centerLabel: string;
  size?: number;
  strokeWidth?: number;
};

export function DonutChart({
  data,
  centerValue,
  centerLabel,
  size = 220,
  strokeWidth = 48,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const center = size / 2;

  let offset = 0;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {data.map((item, index) => {
          const length = total === 0 ? 0 : (item.value / total) * circumference;
          const segment = (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${length} ${circumference}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += length;
          return segment;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-3xl font-bold text-[#101831]">{centerValue}</p>
        <p className="mt-1 text-sm font-medium text-slate-500">{centerLabel}</p>
      </div>
    </div>
  );
}
