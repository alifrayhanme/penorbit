import Link from "next/link";
import Card from "./Card";
import AuthorProfile from "../AuthorProfile";
import CategoryBadge from "./CategoryBadge";
import { formatDate, getValidImageUrl } from '@/lib/utils';

const PostCard = ({ post }) => (
  <Card hover>
    <img 
      src={getValidImageUrl(post.bannerImage)} 
      alt={post.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <CategoryBadge category={post.category} variant="secondary" />
        <span className="text-sm text-gray-500">
          {formatDate(post.createdAt)}
        </span>
      </div>
      <h3 className="text-xl font-semibold mb-2 line-clamp-2">
        <Link href={`/post/${post._id}`} className="hover:text-blue-600">
          {post.title}
        </Link>
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>
      <div className="flex items-center justify-between">
        <AuthorProfile author={post.author} size="sm" />
        <Link 
          href={`/post/${post._id}`}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Read More →
        </Link>
      </div>
    </div>
  </Card>
);

export default PostCard;