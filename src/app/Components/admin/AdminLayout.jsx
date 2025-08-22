import { useEffect } from "react";
import Alert from "../ui/Alert";
import LoadingSpinner from "../ui/LoadingSpinner";

const AdminLayout = ({ 
  title, 
  message, 
  setMessage, 
  actionLoading, 
  activeTab, 
  setActiveTab, 
  tabs, 
  children 
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        
        {message && (
          <Alert 
            type={message.includes('success') || message.includes('deleted') || message.includes('updated') ? 'success' : 'error'}
            className="mb-4"
          >
            {message}
          </Alert>
        )}
        

        
        <div className="flex flex-wrap gap-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
};

export default AdminLayout;