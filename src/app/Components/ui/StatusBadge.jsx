const StatusBadge = ({ status, type = "default" }) => {
  const variants = {
    role: {
      admin: "bg-red-100 text-red-800",
      user: "bg-blue-100 text-blue-800"
    },
    status: {
      active: "bg-green-100 text-green-800",
      suspended: "bg-yellow-100 text-yellow-800",
      unread: "bg-blue-100 text-blue-800",
      read: "bg-gray-100 text-gray-800"
    },
    post: {
      active: "bg-green-100 text-green-800",
      suspended: "bg-red-100 text-red-800"
    }
  };

  const getVariant = () => {
    if (type === "role") return variants.role[status] || variants.role.user;
    if (type === "post") return variants.post[status] || variants.post.active;
    return variants.status[status] || variants.status.active;
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${getVariant()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;