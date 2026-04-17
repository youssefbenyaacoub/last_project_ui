export function Skeleton({ className = "" }) {
  return <div aria-hidden="true" className={`skeleton-block ${className}`} />;
}

export function SkeletonLines({
  lines = 3,
  className = "",
  lineClassName = "h-3 rounded-md",
  lastLineClassName = "w-2/3",
}) {
  const safeLines = Math.max(1, Number(lines) || 1);

  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: safeLines }).map((_, index) => (
        <Skeleton
          key={`skeleton-line-${index}`}
          className={`${lineClassName} ${index === safeLines - 1 ? lastLineClassName : "w-full"}`}
        />
      ))}
    </div>
  );
}
