const Section = ({ children, className = "", title, centered = false }) => (
  <div className={`py-12 ${className}`}>
    <div className="max-w-screen-xl mx-auto px-4">
      {title && (
        <h2 className={`text-3xl font-bold mb-8 ${centered ? 'text-center' : ''}`}>
          {title}
        </h2>
      )}
      {children}
    </div>
  </div>
);

export default Section;