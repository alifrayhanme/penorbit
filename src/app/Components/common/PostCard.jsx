import Link from "next/link";
import Image from "next/image";
import AuthorProfile from "../AuthorProfile";
import Button from "../ui/Button";
import { formatDate, isValidImageUrl } from "@/lib/utils";

const PostCard = ({ post, showAuthor = true, showStats = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {isValidImageUrl(post.bannerImage) && (
        <div className="relative h-48 w-full">
          <Image
            src={post.bannerImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {post.category || "General"}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(post.createdAt)}
          </span>
        </div>
        
        <Link href={`/post/${post._id || post.id}`}>
          <h3 className="text-xl font-semibold mb-3 hover:text-blue-600 cursor-pointer line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>
        
        {showAuthor && post.author && (
          <div className="mb-4">
            <AuthorProfile author={post.author} size="sm" />
          </div>
        )}
        
        {showStats && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{post.likes || 0} likes</span>
              <span>{post.comments?.length || 0} comments</span>
            </div>
            <Button as={Link} href={`/post/${post._id || post.id}`} size="sm">
              Read More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;