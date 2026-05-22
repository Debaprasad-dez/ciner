export function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

export function PosterShimmer() {
  return <div className="shimmer aspect-[2/3] w-full rounded-2xl" />;
}
