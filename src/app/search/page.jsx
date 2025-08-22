"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import AuthorProfile from "../Components/AuthorProfile";
import Button from "@/app/Components/ui/Button";
import Card from "@/app/Components/ui/Card";
import LoadingSpinner from "@/app/Components/ui/LoadingSpinner";
import { useFetch } from "@/hooks/useFetch";
import { formatDate } from "@/lib/utils";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('category') || '';
  const { data: posts, loading } = useFetch('/api/posts');
  
  const filteredPosts = useMemo(() => {
    if (!query || !posts) return [];
    return posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.summary.toLowerCase().includes(query.toLowerCase()) ||
      post.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, posts]);

  if (loading) return (
    <div className="flex justify-center py-10">
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>
        {query && (
          <p className="text-gray-600">
            {filteredPosts.length} results found for "{query}"
          </p>
        )}
      </div>

      {!query ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Enter a search term to find posts</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">No posts found matching your search</p>
          <Button as={Link} href="/">Browse All Posts</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} hover className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Link href={`/post/${post.id}`}>
                    <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-3">{post.summary}</p>
                  <div className="flex items-center justify-between mb-3">
                    <AuthorProfile author={post.author} size="sm" />
                    <span className="text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span>{post.likes || 0} likes</span>
                    <span>{post.comments?.length || 0} comments</span>
                  </div>
                </div>
              </div>
              <Button as={Link} href={`/post/${post.id}`}>Read More</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-10">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}