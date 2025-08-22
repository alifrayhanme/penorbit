const Input = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-lg font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`border border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-red-500 text-sm">{error}</span>
      )}
    </div>
  );
};

export default Input;