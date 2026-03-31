const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 rounded-xl bg-muted space-y-2">
          <div className="h-5 w-12 bg-background rounded" />
          <div className="h-3 w-20 bg-background rounded" />
        </div>
      ))}
    </div>
  );
};

export default StatsSkeleton;