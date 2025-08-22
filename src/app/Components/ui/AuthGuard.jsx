import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Alert from "./Alert";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";

const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false,
  fallback = null 
}) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (requireAuth && !user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Alert type="error" className="mb-4">
            Please sign in to access this page
          </Alert>
          <Button as={Link} href="/auth/signin">Sign In</Button>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Alert type="error" className="mb-4">
            Admin access required
          </Alert>
          <Button as={Link} href="/">Go Home</Button>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;