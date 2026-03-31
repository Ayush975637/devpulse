const DevScoreSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-10 w-24 bg-gray-300 rounded mx-auto" />
    <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />

    {[...Array(5)].map((_, i) => (
      <div key={i} className="space-y-1">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-2 w-full bg-gray-300 rounded" />
      </div>
    ))}
  </div>
);
export default DevScoreSkeleton;