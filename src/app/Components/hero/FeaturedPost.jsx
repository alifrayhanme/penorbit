import Link from "next/link";
import PostImage from "../ui/PostImage";
import CategoryBadge from "../ui/CategoryBadge";
import PostMeta from "../ui/PostMeta";

const FeaturedPost = ({ post }) => (
  <div className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <Link href={`/post/${post._id}`}>
      <div className="relative h-64 lg:h-full">
        <PostImage 
          src={post.bannerImage} 
          alt={post.title}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mb-2">
            <CategoryBadge category={post.category || 'Featured'} />
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold mb-3 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-200 mb-3 line-clamp-2">
            {post.summary}
          </p>
          <PostMeta author={post.author} date={post.createdAt} />
        </div>
      </div>
    </Link>
  </div>
);

export default FeaturedPost;