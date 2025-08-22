import LoadingSpinner from './LoadingSpinner';

const Suspense = ({ children, loading, fallback }) => {
  if (loading) {
    return fallback || (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return children;
};

export default Suspense;