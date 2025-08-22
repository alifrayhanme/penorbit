const PageContainer = ({ 
  children, 
  maxWidth = "max-w-screen-xl", 
  padding = "px-4 py-8",
  className = "" 
}) => (
  <div className={`${maxWidth} mx-auto ${padding} ${className}`}>
    {children}
  </div>
);

export default PageContainer;