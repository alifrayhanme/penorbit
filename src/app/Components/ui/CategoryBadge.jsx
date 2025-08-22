const CategoryBadge = ({ category, variant = "primary" }) => {
  const variants = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-100 text-gray-700"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {category || 'Article'}
    </span>
  );
};

export default CategoryBadge;