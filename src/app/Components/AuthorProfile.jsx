import { FaUser } from "react-icons/fa";
import { generateInitials } from '@/lib/utils';

const AuthorProfile = ({ author, size = "md", showEmail = false, showProfession = true }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base", 
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  };

  if (!author) {
    return (
      <div className="flex items-center space-x-2">
        <div className={`${sizes[size]} bg-gray-300 rounded-full flex items-center justify-center`}>
          <FaUser className="text-gray-600" />
        </div>
        <div>
          <p className={`${textSizes[size]} font-medium text-gray-500`}>Anonymous</p>
          {showProfession && <p className="text-xs text-gray-400">Unknown</p>}
          {showEmail && <p className="text-xs text-gray-400">No email</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {author.profilePic ? (
        <img 
          src={author.profilePic} 
          alt={author.name}
          className={`${sizes[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizes[size]} bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold`}>
          {generateInitials(author.name)}
        </div>
      )}
      <div>
        <p className={`${textSizes[size]} font-medium text-gray-800`}>
          {author.name || "Unknown Author"}
        </p>
        {showProfession && author.profession && (
          <p className="text-xs text-gray-500">{author.profession}</p>
        )}
        {showEmail && author.email && (
          <p className="text-xs text-gray-500">{author.email}</p>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;