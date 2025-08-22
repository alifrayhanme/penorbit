"use client";

import Link from "next/link";
import AuthorProfile from "./AuthorProfile";
import Card from "./ui/Card";
import LoadingSpinner from "./ui/LoadingSpinner";
import Button from "./ui/Button";
import { useFetch } from '@/hooks/useFetch';
import { formatDate, getValidImageUrl } from '@/lib/utils';

const LatestPosts = () => {
  const { data: posts, loading } = useFetch('/api/posts');
  const latestPosts = (posts || []).slice(0, 6);

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Latest Posts</h2>
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (latestPosts.length === 0) {
    return (
      <div className="py-12">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
          <p className="text-gray-600 mb-6">No posts available yet.</p>
          <Button as={Link} href="/createblog">
            Create First Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Latest Posts</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <Card key={post._id} hover>
              <img 
                src={getValidImageUrl(post.bannerImage)} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {post.category}
                  </span>
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
          ))}
        </div>
        
        {latestPosts.length >= 6 && (
          <div className="text-center mt-8">
            <Button as={Link} href="/post" variant="secondary">
              View All Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestPosts;