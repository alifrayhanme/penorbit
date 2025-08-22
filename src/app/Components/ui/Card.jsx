const Card = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  
  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;