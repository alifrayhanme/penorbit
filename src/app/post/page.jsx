"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/app/Components/ui/Button";
import Card from "@/app/Components/ui/Card";
import LoadingSpinner from "@/app/Components/ui/LoadingSpinner";
import Alert from "@/app/Components/ui/Alert";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";

const PostsPage = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const showUserPosts = searchParams.get("user") === "me";
  const { data: allPosts, loading } = useFetch("/api/posts");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (allPosts) {
      if (showUserPosts && user) {
        setPosts(
          allPosts.filter((post) => {
            if (!post?.authorId) return false;
            return post.authorId.toString() === user.id.toString();
          })
        );
      } else {
        setPosts(allPosts);
      }
    }
  }, [allPosts, showUserPosts, user]);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (showUserPosts && !user) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="text-center py-10">
          <Alert type="error" className="mb-4">
            Please sign in to view your posts
          </Alert>
          <Button as={Link} href="/auth/signin">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!posts?.length) {
    const isUserPosts = showUserPosts && user;
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="text-center py-10">
          <h1 className="text-3xl font-bold mb-4">
            {isUserPosts ? "My Posts" : "All Posts"}
          </h1>
          <p className="mb-4 text-gray-600">
            {isUserPosts
              ? "You haven't created any posts yet."
              : "No posts available."}
          </p>
          <Button as={Link} href="/createblog">
            Create a Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {showUserPosts
            ? `My Posts (${posts.length})`
            : `All Posts (${posts.length})`}
        </h1>
        <div className="flex gap-2">
          <Button
            as={Link}
            href="/post"
            variant={!showUserPosts ? "primary" : "secondary"}
            size="sm"
          >
            All Posts
          </Button>
          {user && (
            <Button
              as={Link}
              href="/post?user=me"
              variant={showUserPosts ? "primary" : "secondary"}
              size="sm"
            >
              My Posts
            </Button>
          )}
          <Button as={Link} href="/createblog" variant="success" size="sm">
            Create Post
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post._id} hover className="sm:p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.summary}</p>
                <Button as={Link} href={`/post/${post._id}`} size="sm">
                    Read More
                  </Button>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                  <span>By: {post.author?.name || "Unknown"}</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <span>{post.likes || 0} likes</span>
                  <span>{post.comments?.length || 0} comments</span>
                </div>

              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
