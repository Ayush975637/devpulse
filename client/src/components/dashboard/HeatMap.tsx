const Heatmap = ({ datax }) => {
  const weeks = [];
  if(!datax){
    return null;
  }

  for (let i = 0; i < datax.length; i += 7) {
    weeks.push(datax.slice(i, i + 7));
  }

  const getColor = (count) => {
    if (count === 0) return "bg-yellow-100";
    if (count < 2) return "bg-green-200";
    if (count < 5) return "bg-green-400";
    if (count < 10) return "bg-green-600";
    return "bg-green-800";
  };

  return (
    <div className="w-full ">
    <div className="flex gap-1  w-full   ">
      {weeks.map((week, i) => (
        <div key={i} className="flex flex-col gap-1">
          {week.map((day, j) => (
            <div
              key={j}
              title={`${day.date}: ${day.contributionCount} commits`}
              className={`w-3 h-3 rounded-sm ${getColor(day.contributionCount)} hover:scale-125 transition   `}
            />
          ))}
        </div>
      ))}
    </div>
    </div>
  );
};
export default Heatmap
