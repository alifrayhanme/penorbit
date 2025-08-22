

const CategoryDate = ({ category, date }) => {
  return (
    <div className="flex items-center text-sm text-gray-500 mb-4 space-x-2">
      <p className="font-semibold text-blue-600">{category}</p>
      <span>•</span>
      <p>{date}</p>
    </div>
  );
};

export default CategoryDate;
