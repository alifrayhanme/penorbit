const FormField = ({ children, showCounter, currentLength, maxLength }) => (
  <div>
    {children}
    {showCounter && (
      <div className="text-right text-sm text-gray-500 mt-1">
        {currentLength}/{maxLength}
      </div>
    )}
  </div>
);

export default FormField;