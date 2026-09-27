interface ScoreGaugeProps {
  score: number;
  max?: number;
  label?: string;
  size?: number;
  className?: string;
}

export function ScoreGauge({
  score,
  max = 100,
  label = "Score de préparation",
  size = 180,
  className,
}: ScoreGaugeProps) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const gradId = `gaugeGrad-${size}-${Math.round(score)}`;

  return (
    <div
      className={`relative flex items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label} : ${Math.round(score)} sur ${max}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8935F" />
            <stop offset="100%" stopColor="#C9A876" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          className="stroke-sand"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-1000 ease-[var(--ease-premium)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[18%] text-center">
        <span className="font-display text-[2.75rem] leading-none tracking-tight text-ink">
          {Math.round(score)}
        </span>
        <span className="mt-0.5 font-display text-base text-muted-light">/{max}</span>
        <span className="mt-2.5 max-w-[10em] text-[0.6875rem] font-medium uppercase leading-snug tracking-wider text-taupe">
          {label}
        </span>
      </div>
    </div>
  );
}
