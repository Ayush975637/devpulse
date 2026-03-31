



const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-gray-300" />

      {/* Name */}
      <div className="h-4 w-40 bg-gray-300 rounded" />

      {/* Username */}
      <div className="h-3 w-24 bg-gray-200 rounded" />

      {/* Bio */}
      <div className="h-3 w-full bg-gray-200 rounded" />
      <div className="h-3 w-3/4 bg-gray-200 rounded" />

      {/* Stats */}
      <div className="flex gap-4 mt-2">
        <div className="h-6 w-16 bg-gray-300 rounded" />
        <div className="h-6 w-16 bg-gray-300 rounded" />
        <div className="h-6 w-16 bg-gray-300 rounded" />
      </div>

    </div>
  );
};
export default ProfileSkeleton;