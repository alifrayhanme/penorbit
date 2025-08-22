const StatCard = ({ title, value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800", 
    purple: "bg-purple-100 text-purple-800",
    orange: "bg-orange-100 text-orange-800"
  };

  const bgColor = colorClasses[color]?.split(' ')[0] || "bg-blue-100";
  const textColor = colorClasses[color]?.split(' ')[1] || "text-blue-800";

  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <h3 className={`font-semibold ${textColor}`}>{title}</h3>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );
};

export default StatCard;