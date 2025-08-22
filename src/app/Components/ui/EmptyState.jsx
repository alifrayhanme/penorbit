import Button from "./Button";
import Link from "next/link";

const EmptyState = ({ 
  title, 
  message, 
  actionText, 
  actionHref, 
  icon 
}) => (
  <div className="text-center">
    {icon && <div className="mb-4">{icon}</div>}
    <h2 className="text-3xl font-bold mb-8">{title}</h2>
    <p className="text-gray-600 mb-6">{message}</p>
    {actionText && actionHref && (
      <Button as={Link} href={actionHref}>
        {actionText}
      </Button>
    )}
  </div>
);

export default EmptyState;