const LanguageSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <div className="flex justify-between mb-1">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-3 w-10 bg-muted rounded" />
          </div>
          <div className="h-2 bg-muted rounded w-full" />
        </div>
      ))}
    </div>
  );
};

export default LanguageSkeleton;