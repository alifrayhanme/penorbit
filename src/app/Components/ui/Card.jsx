const Card = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  
  return (
    <div className={`bg-white rounded-lg  overflow-hidden transition ${className}`}>
      {children}
    </div>
  );
};

export default Card;