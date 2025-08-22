import Link from "next/link";

const NavLink = ({ href, children, active = false, onClick }) => {
  const baseClasses = "block py-2 px-3 lg:p-0";
  const activeClasses = active ? "text-blue-700" : "text-gray-900 hover:text-blue-700";
  
  if (onClick) {
    return (
      <button onClick={onClick} className={`${baseClasses} ${activeClasses}`}>
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={`${baseClasses} ${activeClasses}`}>
      {children}
    </Link>
  );
};

export default NavLink;