import { useEffect } from "react";
import Alert from "./Alert";
import LoadingSpinner from "./LoadingSpinner";

const Toast = ({ 
  message, 
  setMessage, 
  loading = false, 
  position = "bottom-center",
  autoHide = true,
  duration = 3000 
}) => {
  useEffect(() => {
    if (message && autoHide) {
      const timer = setTimeout(() => setMessage(''), duration);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage, autoHide, duration]);

  const positions = {
    "bottom-center": "fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50",
    "top-center": "fixed top-5 left-1/2 transform -translate-x-1/2 z-50",
    "center": "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
  };

  return (
    <>
      {message && (
        <div className={positions[position]}>
          <Alert
            type={message.includes("success") || message.includes("deleted") || message.includes("updated") ? "success" : "error"}
            className="shadow-lg rounded-lg"
          >
            {message}
          </Alert>
        </div>
      )}
      
      {loading && (
        <div className={positions.center}>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-blue-700">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Toast;