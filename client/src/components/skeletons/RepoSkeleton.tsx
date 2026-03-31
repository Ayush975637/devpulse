const RepoSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-4 bg-muted rounded-xl space-y-3">
          <div className="h-4 w-40 bg-background rounded" />
          <div className="h-3 w-full bg-background rounded" />
          <div className="h-3 w-3/4 bg-background rounded" />

          <div className="flex gap-4">
            <div className="h-3 w-10 bg-background rounded" />
            <div className="h-3 w-10 bg-background rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RepoSkeleton;