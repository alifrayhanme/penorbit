import Link from "next/link";
import PostImage from "../ui/PostImage";
import CategoryBadge from "../ui/CategoryBadge";
import PostMeta from "../ui/PostMeta";

const SidePost = ({ post }) => (
  <div className="group cursor-pointer flex-1">
    <Link href={`/post/${post._id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full">
        <div className="flex sm:flex-row flex-col h-full">
          <div className="sm:w-2/5 w-full sm:h-full h-32 relative">
            <PostImage 
              src={post.bannerImage} 
              alt={post.title}
              sizes="(max-width: 640px) 100vw, 40vw"
            />
          </div>
          <div className="sm:w-3/5 w-full p-4 flex flex-col justify-between">
            <div>
              <div className="mb-2">
                <CategoryBadge category={post.category} variant="secondary" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h4>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {post.summary}
              </p>
            </div>
            <PostMeta 
              author={post.author} 
              date={post.createdAt} 
              textSize="text-xs" 
              className="text-gray-500"
            />
          </div>
        </div>
      </div>
    </Link>
  </div>
);

export default SidePost;